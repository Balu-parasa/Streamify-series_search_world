// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
// You'll need to replace this with your actual TMDB API key
const TMDB_API_KEY = 'YOUR_API_KEY_HERE';

export const tmdbApi = {
  getTrending: async () => {
    try {
      if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('Using mock data - please add your TMDB API key');
        return mockTrendingMovies;
      }
      
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.results || mockTrendingMovies;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return mockTrendingMovies;
    }
  },

  searchMovies: async (query) => {
    try {
      if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
        return mockAllMovies.filter(movie => 
          movie.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  getMovieDetails: async (id) => {
    try {
      if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
        const movie = mockAllMovies.find(m => m.id === id);
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
      }

      // Fetch movie details with videos
      const [detailsResponse, videosResponse] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`),
        fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`)
      ]);

      const details = await detailsResponse.json();
      const videos = await videosResponse.json();

      return {
        ...details,
        videos: videos
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
};

export const getImageUrl = (path) => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

export const getBackdropUrl = (path) => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_BACKDROP_BASE_URL}${path}`;
};

// Mock data for demo - trending movies (shown on homepage)
const mockTrendingMovies = [
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

// Extended mock data for search functionality
const mockAllMovies = [
  ...mockTrendingMovies,
  {
    id: 7,
    title: "Avengers: Endgame",
    overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all.",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    release_date: "2019-04-24",
    vote_average: 8.3,
    genre_ids: [28, 12, 18],
    adult: false
  },
  {
    id: 8,
    title: "Avengers: Infinity War",
    overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
    poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    backdrop_path: "/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg",
    release_date: "2018-04-25",
    vote_average: 8.3,
    genre_ids: [28, 12, 878],
    adult: false
  },
  {
    id: 9,
    title: "Iron Man",
    overview: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    poster_path: "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    backdrop_path: "/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    release_date: "2008-04-30",
    vote_average: 7.6,
    genre_ids: [28, 12, 878],
    adult: false
  },
  {
    id: 10,
    title: "Captain America: The First Avenger",
    overview: "During World War II, Steve Rogers is a sickly man from Brooklyn who's transformed into super-soldier Captain America to aid in the war effort.",
    poster_path: "/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
    backdrop_path: "/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg",
    release_date: "2011-07-22",
    vote_average: 7.0,
    genre_ids: [28, 12, 878],
    adult: false
  },
  {
    id: 11,
    title: "Thor",
    overview: "Against his father Odin's will, The Mighty Thor - a powerful but arrogant warrior god - recklessly reignites an ancient war.",
    poster_path: "/bIuOWTtyFPjsFDevqvF3QrD1aun.jpg",
    backdrop_path: "/iAr4BgxdW9WAlFLZNdeFE8bXp7S.jpg",
    release_date: "2011-04-21",
    vote_average: 7.0,
    genre_ids: [28, 12, 14],
    adult: false
  },
  {
    id: 12,
    title: "Guardians of the Galaxy",
    overview: "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.",
    poster_path: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    backdrop_path: "/bHarw8xrmQeqf3t8HpuMY7zoK4x.jpg",
    release_date: "2014-07-30",
    vote_average: 7.9,
    genre_ids: [28, 12, 878],
    adult: false
  },
  {
    id: 13,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    release_date: "2008-07-16",
    vote_average: 9.0,
    genre_ids: [18, 28, 80],
    adult: false
  },
  {
    id: 14,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/pbrkL804c8yAv4Hg3jkbF4a4ONQ.jpg",
    release_date: "2014-11-05",
    vote_average: 8.6,
    genre_ids: [12, 18, 878],
    adult: false
  },
  {
    id: 15,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-15",
    vote_average: 8.8,
    genre_ids: [28, 878, 53],
    adult: false
  },
  {
    id: 16,
    title: "Joker",
    overview: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    release_date: "2019-10-01",
    vote_average: 8.2,
    genre_ids: [80, 18, 53],
    adult: false
  }
];
