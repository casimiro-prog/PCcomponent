"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { MovieApiResponse } from './movieData';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, techMovieIds, filterCategories, processMovieResponse } from './movieData';

const Main = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<typeof filterCategories[number]>('All');
  const [sortBy, setSortBy] = useState<'imdbRating' | 'year'>('year');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
      if (!apiKey) throw new Error("API key missing");

      const uniqueIds = [...new Set(techMovieIds)].filter(id => /^tt\d{7,8}$/.test(id));

      const responses = await Promise.all(
        uniqueIds.map(id => 
          fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}&plot=full`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
        )
      );

      const validMovies = responses
        .filter((res): res is MovieApiResponse => res?.Response === "True")
        .map(processMovieResponse)
        .filter((movie): movie is Movie => movie !== null);

      setMovies(validMovies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => filter === 'All' || movie.tags.includes(filter))
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [movies, filter, sortBy]);

  const MovieCard = useCallback(({ movie }: { movie: Movie }) => (
    <Link href={`/movie/${movie.id}`} className="block" >
      <div className="bg-[#1A1F2A] rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group">
        <div className="relative aspect-[2/3] bg-gray-800">
        {movie.poster !== '/placeholder-poster.jpg' ? (
          <Image
            src={movie.poster}
            alt={`${movie.title} poster`}
            fill
            className="object-cover group-hover:opacity-80 transition-opacity"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex items-center text-sm">
          <span className="text-yellow-400 mr-1">★</span>
          <span>{movie.imdbRating > 0 ? movie.imdbRating.toFixed(1) : 'N/A'}/10</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-mono text-lg font-medium truncate max-w-[70%]">{movie.title}</h3>
          <span className="text-gray-400 text-sm">{movie.year}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {movie.tags.map(tag => (
            <span key={tag} className="text-xs bg-[#121620] text-blue-400 px-2 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-3 line-clamp-2">{movie.plot}</p>
      </div>
      </div>
    </Link>
  ), []);

  return (
    <main className="min-h-screen bg-[#0D1117] text-white px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="bg-[#0D1117]/95 backdrop-blur-lg py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-hide">
          {filterCategories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === category 
                  ? 'bg-[#1F2937] text-white' 
                  : 'bg-[#121620] text-gray-400 hover:bg-[#1A1F2A]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setSortBy(prev => prev === 'imdbRating' ? 'year' : 'imdbRating')}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#121620] rounded-md border border-[#1F2937] hover:bg-[#1A1F2A] transition-colors"
        >
          Sort by: {sortBy === 'imdbRating' ? 'Rating' : 'Year'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-blue-500" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-400">
          <p className="max-w-md text-center">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {filteredMovies.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No movies found with current filters
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Main;