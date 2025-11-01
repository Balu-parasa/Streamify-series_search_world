import { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBackdropUrl } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';

const Hero = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  if (!currentMovie) return null;

  return (
    <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getBackdropUrl(currentMovie.backdrop_path)}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-6 line-clamp-3">
              {currentMovie.overview}
            </p>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 text-yellow-400">
                <span className="text-2xl">⭐</span>
                <span className="text-lg font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/movie/${currentMovie.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-400 text-white hover:bg-white hover:text-black font-semibold px-8"
                >
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
