import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MovieCard from '@/components/MovieCard';
import { Movie, tmdbApi } from '@/lib/tmdb';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Index = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useDocumentTitle();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: tmdbApi.getTrending,
  });

  useEffect(() => {
    const savedFavorites = localStorage.getItem('streamify_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleToggleFavorite = (movie: Movie) => {
    const newFavorites = favorites.includes(movie.id)
      ? favorites.filter(id => id !== movie.id)
      : [...favorites, movie.id];
    
    setFavorites(newFavorites);
    localStorage.setItem('streamify_favorites', JSON.stringify(newFavorites));
    localStorage.setItem(`movie_${movie.id}`, JSON.stringify(movie));
  };

  const heroMovies = movies.slice(0, 3);
  const trendingMovies = movies.slice(0, 12);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      {isLoading ? (
        <div className="h-[70vh] lg:h-[80vh] bg-gray-900 animate-pulse" />
      ) : (
        <Hero movies={heroMovies} />
      )}

      {/* Trending Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Trending Now</h2>
          <p className="text-gray-400">Discover what's popular this week</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[2/3] rounded-xl bg-gray-800" />
                <Skeleton className="h-4 bg-gray-800" />
                <Skeleton className="h-3 bg-gray-800 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(movie.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Streamify
            </h3>
            <p className="text-gray-400">Your ultimate movie discovery platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
