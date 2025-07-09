
import { useEffect } from 'react';

export const useFaviconRemover = () => {
  useEffect(() => {
    // Remove all existing favicon links
    const faviconLinks = document.querySelectorAll('link[rel*="icon"]');
    faviconLinks.forEach(link => link.remove());
    
    // Also remove apple-touch-icon if present
    const appleTouchIcons = document.querySelectorAll('link[rel="apple-touch-icon"]');
    appleTouchIcons.forEach(link => link.remove());
  }, []);
};
