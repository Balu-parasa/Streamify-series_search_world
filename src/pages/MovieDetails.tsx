
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Heart, Star, Calendar, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { MovieDetails as MovieDetailsType, tmdbApi, getBackdropUrl, getImageUrl } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const movieData = await tmdbApi.getMovieDetails(parseInt(id));
        setMovie(movieData);
        
        // Check if movie is in favorites
        const savedFavorites = localStorage.getItem('streamify_favorites');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          setIsFavorite(favorites.includes(parseInt(id)));
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!movie) return;

    const savedFavorites = localStorage.getItem('streamify_favorites');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fId: number) => fId !== movie.id);
      localStorage.setItem('streamify_favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: movie.title,
      });
    } else {
      const newFavorites = [...favorites, movie.id];
      localStorage.setItem('streamify_favorites', JSON.stringify(newFavorites));
      localStorage.setItem(`movie_${movie.id}`, JSON.stringify(movie));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: movie.title,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="relative">
          <Skeleton className="h-[60vh] w-full bg-gray-800" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-3/4 bg-gray-800" />
                <Skeleton className="h-4 w-full bg-gray-800" />
                <Skeleton className="h-4 w-full bg-gray-800" />
                <Skeleton className="h-4 w-2/3 bg-gray-800" />
              </div>
              <div>
                <Skeleton className="aspect-[2/3] w-full bg-gray-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
            <Link to="/">
              <Button>Go back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trailerKey = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  )?.key;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-video lg:aspect-[21/9] relative overflow-hidden">
          <img
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <Link to="/">
          <Button
            variant="ghost"
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex items-center space-x-6 mb-6 text-white">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {trailerKey && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailerKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Trailer
                    </Button>
                  </a>
                )}
                <Button
                  onClick={handleToggleFavorite}
                  size="lg"
                  variant="outline"
                  className={`border-gray-400 text-white hover:bg-white hover:text-black ${
                    isFavorite ? 'bg-red-600 border-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {movie.overview}
            </p>

            {/* Trailer Section */}
            {trailerKey && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Trailer</h3>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`${movie.title} Trailer`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-8">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl mb-6"
              />
              
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Movie Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Release Date:</span>
                    <span className="text-white ml-2">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Runtime:</span>
                    <span className="text-white ml-2">{movie.runtime} minutes</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white ml-2">{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Genres:</span>
                    <span className="text-white ml-2">
                      {movie.genres.map(g => g.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
