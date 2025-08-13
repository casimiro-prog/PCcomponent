"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import {
  Movie,
  techMovieIds,
  processMovieResponse,
  MovieApiResponse,
} from "@/components/movieData";

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
        if (!techMovieIds.includes(id as (typeof techMovieIds)[number])) {
          setError("Movie not found");
          setLoading(false);
          return;
        }

        // Fetch movie details from OMDB API
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=${
            process.env.NEXT_PUBLIC_OMDB_API_KEY || "your_api_key"
          }`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data: MovieApiResponse = await response.json();
        const processedMovie = processMovieResponse(data);

        if (!processedMovie) {
          setError("Failed to process movie data");
          setLoading(false);
          return;
        }

        setMovie(processedMovie);
        setLoading(false);

        // Fetch YouTube trailer using YouTube API
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!apiKey) {
          throw new Error("YouTube API key not configured");
        }

        const searchQuery = `${processedMovie.title} ${processedMovie.year} official trailer`;
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
            new URLSearchParams({
              part: "snippet",
              q: searchQuery,
              maxResults: "1",
              type: "video",
              key: apiKey,
              order: "relevance",
            })
        );

        if (!youtubeResponse.ok) {
          throw new Error("Failed to fetch YouTube trailer");
        }

        const youtubeData = await youtubeResponse.json();
        const videoId = youtubeData.items?.[0]?.id?.videoId;

        setTrailer({
          loading: false,
          error: videoId ? null : "No trailer found",
          videoId: videoId || null,
        });
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
          <p className="text-gray-400">{error || "Movie not found"}</p>
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
                <div className="text-gray-300">Director: {movie.director}</div>
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
                  className="w-full text-white py-2 px-4 rounded-lg text-center block border mb-4"
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