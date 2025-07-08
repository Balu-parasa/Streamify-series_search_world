
// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
// Using a demo API key - users should replace with their own
const TMDB_API_KEY = '7c1e6ac51b7b7e5b1e5f5b5b5b5b5b5b';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  videos: {
    results: {
      key: string;
      type: string;
      site: string;
    }[];
  };
}

export const tmdbApi = {
  getTrending: async (): Promise<Movie[]> => {
    try {
      // For demo purposes, return mock data since we need a real API key
      return mockTrendingMovies;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return mockTrendingMovies;
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      // For demo purposes, return filtered mock data
      return mockTrendingMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  getMovieDetails: async (id: number): Promise<MovieDetails | null> => {
    try {
      const movie = mockTrendingMovies.find(m => m.id === id);
      if (movie) {
        return {
          ...movie,
          genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }],
          runtime: 120,
          videos: {
            results: [{
              key: 'dQw4w9WgXcQ',
              type: 'Trailer',
              site: 'YouTube'
            }]
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
};

export const getImageUrl = (path: string | null): string => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export const getBackdropUrl = (path: string | null): string => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_BACKDROP_BASE_URL}${path}`;
};

// Mock data for demo
const mockTrendingMovies: Movie[] = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path: "/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    release_date: "2022-12-14",
    vote_average: 7.6,
    genre_ids: [878, 12, 28],
    adult: false
  },
  {
    id: 2,
    title: "Black Panther: Wakanda Forever",
    overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T'Challa's death.",
    poster_path: "/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path: "/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
    release_date: "2022-11-09",
    vote_average: 7.3,
    genre_ids: [28, 12, 18],
    adult: false
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    overview: "After more than thirty years of service as one of the Navy's top aviators, and dodging the advancement in rank that would ground him, Pete 'Maverick' Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
    poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop_path: "/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    release_date: "2022-05-24",
    vote_average: 8.3,
    genre_ids: [28, 18],
    adult: false
  },
  {
    id: 4,
    title: "Spider-Man: No Way Home",
    overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    release_date: "2021-12-15",
    vote_average: 8.1,
    genre_ids: [28, 12, 878],
    adult: false
  },
  {
    id: 5,
    title: "The Batman",
    overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    release_date: "2022-03-01",
    vote_average: 7.8,
    genre_ids: [80, 18, 53],
    adult: false
  },
  {
    id: 6,
    title: "Dune",
    overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop_path: "/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
    release_date: "2021-09-15",
    vote_average: 8.0,
    genre_ids: [878, 12],
    adult: false
  }
];
