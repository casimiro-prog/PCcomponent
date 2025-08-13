export interface Movie {
  id: string;
  title: string;
  year: number;
  imdbRating: number;
  poster: string;
  tags: string[];
  plot: string;
  director: string;
  genre: string[];
  mediaType: 'movie' | 'tv' | 'animation';
}

export interface TMDbMovieResponse {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  media_type?: string;
}

export interface TMDbSearchResponse {
  results: TMDbMovieResponse[];
  total_pages: number;
  total_results: number;
}

export interface TMDbGenre {
  id: number;
  name: string;
}

export interface TMDbGenresResponse {
  genres: TMDbGenre[];
}

export interface TMDbCreditsResponse {
  crew: Array<{
    job: string;
    name: string;
  }>;
}

// TMDb genre IDs mapping
export const genreMapping: Record<number, string[]> = {
  // Sci-Fi genres
  878: ['Sci-Fi', 'Tech'], // Science Fiction
  
  // Animation
  16: ['Tech'], // Animation
  
  // Documentary
  99: ['Tech'], // Documentary
  
  // Thriller/Crime (often tech-related)
  53: ['Hacking'], // Thriller
  80: ['Hacking'], // Crime
  
  // Action (often has tech elements)
  28: ['Tech'], // Action
  
  // Drama (tech documentaries, biopics)
  18: ['Tech'], // Drama
};

// Keywords that help identify tech-related content
export const techKeywords = [
  {word: 'computer', category: 'Coding'},
  {word: 'code', category: 'Coding'},
  {word: 'program', category: 'Coding'},
  {word: 'algorithm', category: 'Coding'},
  {word: 'software', category: 'Coding'},
  {word: 'developer', category: 'Coding'},
  {word: 'hack', category: 'Hacking'},
  {word: 'cyber', category: 'Hacking'},
  {word: 'security', category: 'Hacking'},
  {word: 'surveillance', category: 'Hacking'},
  {word: 'artificial intelligence', category: 'AI'},
  {word: 'robot', category: 'AI'},
  {word: 'neural network', category: 'AI'},
  {word: 'machine learning', category: 'AI'},
  {word: 'ai', category: 'AI'},
  {word: 'virtual reality', category: 'VirtualReality'},
  {word: 'simulation', category: 'VirtualReality'},
  {word: 'matrix', category: 'VirtualReality'},
  {word: 'digital', category: 'VirtualReality'},
  {word: 'space', category: 'Sci-Fi'},
  {word: 'future', category: 'Sci-Fi'},
  {word: 'technology', category: 'Tech'},
  {word: 'internet', category: 'Tech'},
  {word: 'startup', category: 'Tech'},
  {word: 'silicon valley', category: 'Tech'}
];

export const filterCategories = ['All', 'AI', 'Coding', 'Sci-Fi', 'Hacking', 'VirtualReality', 'Tech'] as const;

// Curated list of tech-related movies, TV shows, and animations
export const techContentQueries = [
  // Movies
  'matrix', 'blade runner', 'ex machina', 'her', 'social network', 'imitation game',
  'terminator', 'minority report', 'ghost in the shell', 'tron', 'hackers',
  'war games', 'the net', 'johnny mnemonic', 'strange days', 'gattaca',
  'elysium', 'transcendence', 'chappie', 'upgrade', 'ready player one',
  'source code', 'primer', 'predestination', 'looper', 'arrival',
  'interstellar', 'gravity', 'martian', 'moon', 'oblivion',
  
  // TV Shows
  'black mirror', 'westworld', 'mr robot', 'silicon valley', 'halt and catch fire',
  'person of interest', 'devs', 'upload', 'altered carbon', 'electric dreams',
  'love death robots', 'cyberpunk edgerunners', 'ghost in the shell sac',
  'serial experiments lain', 'psycho pass', 'steins gate', 'code geass',
  'akira', 'appleseed', 'battle angel alita', 'cowboy bebop',
  
  // Documentaries
  'social dilemma', 'great hack', 'terms and conditions may apply',
  'citizenfour', 'we are legion', 'the internet own boy', 'code red',
  'alphago', 'lo and behold', 'inside bills brain', 'steve jobs',
  'pirates of silicon valley', 'startup com', 'something ventured'
];

const generateTagsFromContent = (content: TMDbMovieResponse): string[] => {
  const plot = content.overview?.toLowerCase() || '';
  const title = (content.title || content.name || '').toLowerCase();
  const tags = new Set<string>();

  // Check genre mappings
  content.genre_ids?.forEach(genreId => {
    const mappedTags = genreMapping[genreId];
    if (mappedTags) {
      mappedTags.forEach(tag => tags.add(tag));
    }
  });

  // Check keywords in plot and title
  techKeywords.forEach(({word, category}) => {
    if (plot.includes(word.toLowerCase()) || title.includes(word.toLowerCase())) {
      tags.add(category);
    }
  });

  // Special cases based on title
  if (title.includes('matrix')) tags.add('VirtualReality').add('AI');
  if (title.includes('blade runner')) tags.add('AI').add('Sci-Fi');
  if (title.includes('terminator')) tags.add('AI').add('Sci-Fi');
  if (title.includes('social network')) tags.add('Coding').add('Tech');
  if (title.includes('silicon valley')) tags.add('Coding').add('Tech');
  if (title.includes('mr robot') || title.includes('mr. robot')) tags.add('Hacking').add('Coding');
  if (title.includes('black mirror')) tags.add('Tech').add('Sci-Fi');
  if (title.includes('westworld')) tags.add('AI').add('Sci-Fi');
  if (title.includes('ghost in the shell')) tags.add('AI').add('Hacking');
  if (title.includes('tron')) tags.add('VirtualReality').add('Tech');
  if (title.includes('ready player one')) tags.add('VirtualReality').add('Tech');

  return Array.from(tags).slice(0, 5);
};

const determineMediaType = (content: TMDbMovieResponse): 'movie' | 'tv' | 'animation' => {
  if (content.media_type === 'tv') return 'tv';
  if (content.genre_ids?.includes(16)) return 'animation'; // Animation genre
  return 'movie';
};

export const processMovieResponse = async (content: TMDbMovieResponse): Promise<Movie | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) return null;

    // Get director information
    let director = 'Unknown';
    try {
      const creditsResponse = await fetch(
        `https://api.themoviedb.org/3/${content.media_type || 'movie'}/${content.id}/credits?api_key=${apiKey}`
      );
      if (creditsResponse.ok) {
        const credits: TMDbCreditsResponse = await creditsResponse.json();
        const directorInfo = credits.crew?.find(person => person.job === 'Director');
        if (directorInfo) director = directorInfo.name;
      }
    } catch (error) {
      console.warn('Failed to fetch director info:', error);
    }

    // Get genre names
    const genreNames: string[] = [];
    try {
      const movieGenresResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
      const tvGenresResponse = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`);
      
      if (movieGenresResponse.ok && tvGenresResponse.ok) {
        const movieGenres: TMDbGenresResponse = await movieGenresResponse.json();
        const tvGenres: TMDbGenresResponse = await tvGenresResponse.json();
        const allGenres = [...movieGenres.genres, ...tvGenres.genres];
        
        content.genre_ids?.forEach(genreId => {
          const genre = allGenres.find(g => g.id === genreId);
          if (genre) genreNames.push(genre.name);
        });
      }
    } catch (error) {
      console.warn('Failed to fetch genre names:', error);
    }

    return {
      id: content.id.toString(),
      title: content.title || content.name || 'Unknown Title',
      year: parseInt((content.release_date || content.first_air_date || '').split('-')[0]) || 0,
      imdbRating: Math.round(content.vote_average * 10) / 10,
      poster: content.poster_path 
        ? `https://image.tmdb.org/t/p/w500${content.poster_path}` 
        : '/placeholder-poster.jpg',
      tags: generateTagsFromContent(content),
      plot: content.overview || 'No description available',
      director,
      genre: genreNames,
      mediaType: determineMediaType(content)
    };
  } catch (error) {
    console.error('Error processing movie response:', error);
    return null;
  }
};

export const searchTechContent = async (query: string = '', page: number = 1): Promise<Movie[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) throw new Error("TMDb API key missing");

    let allResults: TMDbMovieResponse[] = [];

    if (query.trim()) {
      // Search for specific query
      const searchResponse = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (searchResponse.ok) {
        const searchData: TMDbSearchResponse = await searchResponse.json();
        allResults = searchData.results.filter(item => 
          item.media_type === 'movie' || item.media_type === 'tv'
        );
      }
    } else {
      // Get curated tech content
      const searchPromises = techContentQueries.slice(0, 10).map(async (searchQuery) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`
          );
          if (response.ok) {
            const data: TMDbSearchResponse = await response.json();
            return data.results.slice(0, 2); // Take top 2 results per query
          }
          return [];
        } catch {
          return [];
        }
      });

      const searchResults = await Promise.all(searchPromises);
      allResults = searchResults.flat().filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );
    }

    // Remove duplicates
    const uniqueResults = allResults.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );

    // Process results
    const processedMovies = await Promise.all(
      uniqueResults.map(item => processMovieResponse(item))
    );

    return processedMovies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error searching tech content:', error);
    return [];
  }
};