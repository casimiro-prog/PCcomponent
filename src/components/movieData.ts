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
}

export interface MovieApiResponse {
  imdbID: string;
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  Genre: string;
  Director: string;
  Response: string;
  Ratings: { Source: string; Value: string }[];
}

export const techMovieIds = [
  'tt0133093', // The Matrix
  'tt0234215', // The Matrix Reloaded
  'tt0343818', // I, Robot
  'tt0470752', // Ex Machina
  'tt0434409', // V for Vendetta
  'tt1798709', // Her
  'tt0062622', // 2001: A Space Odyssey
  'tt1285016', // The Social Network
  'tt0119116', // The Fifth Element
  'tt0107290', // Jurassic Park
  'tt0088247', // The Terminator
  'tt0103064', // Terminator 2: Judgment Day
  'tt6700846', // AlphaGo
  'tt0126765', // 23
  'tt0181689', // Minority Report
  'tt1856101', // Blade Runner 2049
  'tt0083658', // Blade Runner
  'tt0113568', // Ghost in the Shell
  'tt2084970', // Imitation Game
  'tt0256408', // Startup.com
  'tt1568346', // The girl with the dragon tattoo
  'tt4736550', // The Great Hack
  'tt0945513', // Source Code
  'tt2177843', // We are Legion
  'tt0168122', // Pirates of Silicon Valley
  'tt11464826', // The social dilemma
  'tt2821314', // The rise and rise of bitcoin
  'tt10837476', // Inside Bill's Brain
  'tt5275828', // Lo and Behold
  'tt2084953', // Terms and Conditions May Apply
  'tt4044364', // Citizenfour
  'tt3042408', // Who am I
  'tt1104001', // Tron: legacy
] as const;

export const techKeywords = [
  {word: 'computer', category: 'Coding'},
  {word: 'code', category: 'Coding'},
  {word: 'program', category: 'Coding'},
  {word: 'algorithm', category: 'Coding'},
  {word: 'hack', category: 'Hacking'},
  {word: 'cyber', category: 'Hacking'},
  {word: 'security', category: 'Hacking'},
  {word: 'artificial intelligence', category: 'AI'},
  {word: 'robot', category: 'AI'},
  {word: 'neural network', category: 'AI'},
  {word: 'virtual reality', category: 'VirtualReality'},
  {word: 'simulation', category: 'VirtualReality'},
  {word: 'space', category: 'Sci-Fi'},
  {word: 'future', category: 'Sci-Fi'},
  {word: 'technology', category: 'Tech'}
];

export const filterCategories = ['All', 'AI', 'Coding', 'Sci-Fi', 'Hacking', 'VirtualReality', 'Tech'] as const;

const parseImdbRating = (ratings: MovieApiResponse['Ratings']): number => {
  try {
    const imdbRating = ratings?.find(r => r.Source === 'Internet Movie Database')?.Value;
    if (!imdbRating || imdbRating === 'N/A') return 0;
    
    const [ratingValue] = imdbRating.split('/');
    return parseFloat(ratingValue);
  } catch (error) {
    console.error('Error parsing IMDb rating:', error);
    return 0;
  }
};

export const generateTagsFromMovie = (movieDetail: MovieApiResponse): string[] => {
  const plot = movieDetail.Plot?.toLowerCase() || '';
  const genres = movieDetail.Genre?.split(', ') || [];
  const tags = new Set<string>();

  if (genres.includes('Sci-Fi')) tags.add('Sci-Fi');
  if (genres.includes('Documentary')) tags.add('Tech');

  techKeywords.forEach(({word, category}) => {
    if (plot.includes(word.toLowerCase())) tags.add(category);
  });

  switch (movieDetail.imdbID) {
    case 'tt0133093': // The Matrix
      tags.add('VirtualReality').add('Tech');
      break;
    case 'tt0470752': // Ex Machina
      tags.add('AI').add('Tech');
      break;
    case 'tt1285016': // The Social Network
      tags.add('Coding').add('Tech');
      break;
  }

  return Array.from(tags).slice(0, 5);
};

export const processMovieResponse = (movieDetail: MovieApiResponse): Movie | null => {
  if (movieDetail.Response !== 'True' || !techMovieIds.includes(movieDetail.imdbID as typeof techMovieIds[number])) {
    return null;
  }

  return {
    id: movieDetail.imdbID,
    title: movieDetail.Title,
    year: parseInt(movieDetail.Year) || 0,
    imdbRating: parseImdbRating(movieDetail.Ratings),
    poster: movieDetail.Poster !== 'N/A' ? movieDetail.Poster : '/placeholder-poster.jpg',
    tags: generateTagsFromMovie(movieDetail),
    plot: movieDetail.Plot || '',
    director: movieDetail.Director || '',
    genre: movieDetail.Genre?.split(', ') || [],
  };
};