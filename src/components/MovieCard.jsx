import { useState } from 'react';
import { Heart, Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const MovieCard = ({ movie, onToggleFavorite, isFavorite = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: movie.title,
      });
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div 
        className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Movie Poster */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-80" />
            </div>
          </div>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              onClick={handleFavoriteClick}
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          )}

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-gray-500 text-sm line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
