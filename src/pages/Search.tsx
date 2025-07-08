
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';
import MovieCard from '@/components/MovieCard';
import { Movie, tmdbApi } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedFavorites = localStorage.getItem('streamify_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const movies = await tmdbApi.searchMovies(searchQuery);
      setResults(movies);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleToggleFavorite = (movie: Movie) => {
    const newFavorites = favorites.includes(movie.id)
      ? favorites.filter(id => id !== movie.id)
      : [...favorites, movie.id];
    
    setFavorites(newFavorites);
    localStorage.setItem('streamify_favorites', JSON.stringify(newFavorites));
    localStorage.setItem(`movie_${movie.id}`, JSON.stringify(movie));
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Movies</h1>
          <p className="text-gray-400">Search through thousands of movies and series</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for movies, series..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="tv">TV Shows</SelectItem>
                </SelectContent>
              </Select>
              
              <Button type="submit" className="bg-red-600 hover:bg-red-700 px-8">
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Results */}
        {isLoading ? (
          <div>
            <div className="mb-6">
              <Skeleton className="h-6 w-32 bg-gray-800" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[2/3] rounded-xl bg-gray-800" />
                  <Skeleton className="h-4 bg-gray-800" />
                  <Skeleton className="h-3 bg-gray-800 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Search Results ({results.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {results.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(movie.id)}
                />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Start your search</h3>
            <p className="text-gray-500">Enter a movie or series name to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
