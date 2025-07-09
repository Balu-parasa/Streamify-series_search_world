
import { useEffect } from 'react';

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    } else {
      // Remove/clear the title by setting it to empty
      document.title = '';
    }
    
    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = 'Streamify';
    };
  }, [title]);
};
