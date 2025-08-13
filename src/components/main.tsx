"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, filterCategories, searchTechContent } from './movieData';

const Main = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<typeof filterCategories[number]>('All');
  const [sortBy, setSortBy] = useState<'imdbRating' | 'year'>('year');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchMovies = useCallback(async (query: string = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await searchTechContent(query);
      setMovies(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    await fetchMovies(query);
    setIsSearching(false);
  }, [fetchMovies]);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => filter === 'All' || movie.tags.includes(filter))
      .sort((a, b) => {
        if (sortBy === 'imdbRating') {
          return b.imdbRating - a.imdbRating;
        }
        return b.year - a.year;
      });
  }, [movies, filter, sortBy]);

  const MovieCard = useCallback(({ movie }: { movie: Movie }) => (
    <Link href={`/movie/${movie.id}`} className="block">
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
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-md text-xs">
            {movie.mediaType === 'tv' ? 'TV' : movie.mediaType === 'animation' ? 'ANIM' : 'MOVIE'}
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
      {/* Search Bar */}
      <div className="py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies, TV shows, and animations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
              className="w-full px-4 py-3 pl-12 bg-[#1A1F2A] border border-[#2D3748] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md text-sm transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Results */}
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
          <div className="mt-6 mb-4 text-gray-400 text-sm">
            Showing {filteredMovies.length} results
            {searchQuery && ` for "${searchQuery}"`}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {filteredMovies.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-400">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg mb-2">No content found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Main;