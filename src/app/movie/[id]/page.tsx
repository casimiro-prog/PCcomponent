"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { Movie } from "@/components/movieData";

interface TMDbMovieDetails {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string;
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: Array<{ name: string }>;
  credits?: {
    crew: Array<{ job: string; name: string }>;
  };
}

interface TMDbVideoResponse {
  results: Array<{
    key: string;
    type: string;
    site: string;
    name: string;
  }>;
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<{
    loading: boolean;
    error: string | null;
    videoId: string | null;
  }>({ loading: true, error: null, videoId: null });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          throw new Error("TMDb API key not configured");
        }

        // First, try as movie
        let movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`
        );
        
        let isTV = false;
        let data: TMDbMovieDetails;

        if (!movieResponse.ok) {
          // If movie fails, try as TV show
          const tvResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits`
          );
          
          if (!tvResponse.ok) {
            throw new Error("Content not found");
          }
          
          data = await tvResponse.json();
          isTV = true;
        } else {
          data = await movieResponse.json();
        }

        // Get director/creator
        let director = 'Unknown';
        if (isTV && data.created_by && data.created_by.length > 0) {
          director = data.created_by[0].name;
        } else if (data.credits?.crew) {
          const directorInfo = data.credits.crew.find(person => person.job === 'Director');
          if (directorInfo) director = directorInfo.name;
        }

        // Determine media type
        let mediaType: 'movie' | 'tv' | 'animation' = isTV ? 'tv' : 'movie';
        if (data.genres?.some(genre => genre.id === 16)) {
          mediaType = 'animation';
        }

        // Generate tags based on genres and content
        const tags: string[] = [];
        data.genres?.forEach(genre => {
          switch (genre.id) {
            case 878: // Science Fiction
              tags.push('Sci-Fi', 'Tech');
              break;
            case 16: // Animation
              tags.push('Tech');
              break;
            case 99: // Documentary
              tags.push('Tech');
              break;
            case 53: // Thriller
            case 80: // Crime
              tags.push('Hacking');
              break;
            case 28: // Action
            case 18: // Drama
              tags.push('Tech');
              break;
          }
        });

        // Check for tech keywords in overview and title
        const overview = data.overview?.toLowerCase() || '';
        const title = (data.title || data.name || '').toLowerCase();
        
        const techKeywords = [
          {word: 'computer', category: 'Coding'},
          {word: 'artificial intelligence', category: 'AI'},
          {word: 'robot', category: 'AI'},
          {word: 'hack', category: 'Hacking'},
          {word: 'cyber', category: 'Hacking'},
          {word: 'virtual reality', category: 'VirtualReality'},
          {word: 'technology', category: 'Tech'}
        ];

        techKeywords.forEach(({word, category}) => {
          if (overview.includes(word) || title.includes(word)) {
            if (!tags.includes(category)) tags.push(category);
          }
        });

        const processedMovie: Movie = {
          id: data.id.toString(),
          title: data.title || data.name || 'Unknown Title',
          year: parseInt((data.release_date || data.first_air_date || '').split('-')[0]) || 0,
          imdbRating: Math.round(data.vote_average * 10) / 10,
          poster: data.poster_path 
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
            : '/placeholder-poster.jpg',
          tags: tags.slice(0, 5),
          plot: data.overview || 'No description available',
          director,
          genre: data.genres?.map(g => g.name) || [],
          mediaType
        };

        setMovie(processedMovie);
        setLoading(false);

        // Fetch trailer
        try {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/${isTV ? 'tv' : 'movie'}/${id}/videos?api_key=${apiKey}`
          );
          
          if (videoResponse.ok) {
            const videoData: TMDbVideoResponse = await videoResponse.json();
            const trailerVideo = videoData.results.find(
              video => video.type === 'Trailer' && video.site === 'YouTube'
            );
            
            setTrailer({
              loading: false,
              error: trailerVideo ? null : "No trailer found",
              videoId: trailerVideo?.key || null,
            });
          } else {
            setTrailer({
              loading: false,
              error: "No trailer found",
              videoId: null,
            });
          }
        } catch (err) {
          console.error("Error fetching trailer:", err);
          setTrailer({
            loading: false,
            error: "Failed to load trailer",
            videoId: null,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-400">{error || "Content not found"}</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-[#3B82F6] text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0D1117] text-white px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto pt-6 pb-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Image
              src={movie.poster}
              alt={movie.title}
              width={180}
              height={270}
              className="object-cover rounded-md shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {movie.title}{" "}
                <span className="text-gray-400 text-2xl">({movie.year})</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">{movie.imdbRating}/10</span>
                </div>
                <div className="text-gray-400 hidden md:block">|</div>
                <div className="text-gray-300">{movie.genre.join(", ")}</div>
                <div className="text-gray-400 hidden md:block">|</div>
                <div className="text-gray-300">
                  {movie.mediaType === 'tv' ? 'Creator' : 'Director'}: {movie.director}
                </div>
                <div className="text-gray-400 hidden md:block">|</div>
                <div className="text-blue-400 font-medium">
                  {movie.mediaType === 'tv' ? 'TV Series' : 
                   movie.mediaType === 'animation' ? 'Animation' : 'Movie'}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#1F2937] text-[#3B82F6] text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="lg:block mb-4">
                <h2 className="text-xl font-bold mb-2 border-b border-gray-800 pb-1">
                  Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-1 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-3 border-b border-gray-800 pb-1">
                Trailer
              </h2>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                {trailer.loading ? (
                  <div className="bg-gray-800 w-full h-[350px] rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : trailer.error ? (
                  <div className="bg-gray-800 w-full h-[350px] rounded-lg flex flex-col items-center justify-center">
                    <p className="text-red-500 mb-4">{trailer.error}</p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        `${movie.title} ${movie.year} official trailer`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Search on YouTube
                    </a>
                  </div>
                ) : trailer.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.videoId}`}
                    title={`${movie.title} trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-[350px] rounded-lg"
                  ></iframe>
                ) : (
                  <div className="bg-gray-800 w-full h-[350px] rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Trailer not available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1F2937] rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3">Watch Now</h3>
                <a
                  href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                    movie.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-white py-2 px-4 rounded-lg text-center block border mb-4 hover:bg-gray-700 transition-colors"
                >
                  Find Where to Watch
                </a>

                <div className="mt-4">
                  <h3 className="text-lg font-bold mb-3">
                    Why Developers Love It
                  </h3>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    {movie.tags.includes("AI") && (
                      <li>
                        Explores artificial intelligence concepts and
                        implications
                      </li>
                    )}
                    {movie.tags.includes("Coding") && (
                      <li>
                        Features realistic coding and programming challenges
                      </li>
                    )}
                    {movie.tags.includes("Hacking") && (
                      <li>
                        Showcases cybersecurity concepts and hacking scenarios
                      </li>
                    )}
                    {movie.tags.includes("Tech") && (
                      <li>
                        Highlights innovative technology and its impact on
                        society
                      </li>
                    )}
                    {movie.tags.includes("VirtualReality") && (
                      <li>
                        Dives into virtual reality and simulated environments
                      </li>
                    )}
                    {movie.tags.includes("Sci-Fi") && (
                      <li>Presents compelling vision of future technology</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;