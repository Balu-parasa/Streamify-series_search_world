
import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedFavoriteIds = localStorage.getItem('streamify_favorites');
    if (savedFavoriteIds) {
      const ids = JSON.parse(savedFavoriteIds);
      setFavoriteIds(ids);
      
      // Load movie details from localStorage
      const movies: Movie[] = [];
      ids.forEach((id: number) => {
        const movieData = localStorage.getItem(`movie_${id}`);
        if (movieData) {
          movies.push(JSON.parse(movieData));
        }
      });
      setFavorites(movies);
    }
  }, []);

  const handleToggleFavorite = (movie: Movie) => {
    const newFavoriteIds = favoriteIds.filter(id => id !== movie.id);
    const newFavorites = favorites.filter(fav => fav.id !== movie.id);
    
    setFavoriteIds(newFavoriteIds);
    setFavorites(newFavorites);
    localStorage.setItem('streamify_favorites', JSON.stringify(newFavoriteIds));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    setFavoriteIds([]);
    localStorage.removeItem('streamify_favorites');
    // Clean up individual movie data
    favorites.forEach(movie => {
      localStorage.removeItem(`movie_${movie.id}`);
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign In to Save Favorites</h2>
            <p className="text-gray-400 mb-8">Create an account to save your favorite movies and series</p>
            <Link to="/login">
              <Button className="bg-red-600 hover:bg-red-700">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
            <p className="text-gray-400">
              {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          
          {favorites.length > 0 && (
            <Button
              onClick={clearAllFavorites}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-8">Start adding movies to your favorites list</p>
            <Link to="/search">
              <Button className="bg-red-600 hover:bg-red-700">Browse Movies</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
