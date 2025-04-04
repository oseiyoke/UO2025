'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePosts } from '../context/PostsContext';

/**
 * This component controls the loading of posts based on page visibility
 * It ensures posts are only fetched when on the wall-of-love page and
 * prevents excessive API calls
 */
export default function PostsLoadingControl() {
  const pathname = usePathname();
  const { posts, fetchPosts, lastFetched, loading } = usePosts();
  const isWallOfLovePage = pathname === '/wall-of-love';
  
  // Initialize posts only when needed
  useEffect(() => {
    // Don't do anything if already loading
    if (loading) return;
    
    // Only fetch posts if we're on the Wall of Love page
    if (isWallOfLovePage) {
      const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes (increased to reduce API calls)
      const MINIMUM_REFRESH_INTERVAL = 60 * 1000; // 1 minute minimum between refresh attempts
      
      // Calculate time since last fetch
      const timeSinceLastFetch = lastFetched ? Date.now() - lastFetched : Number.MAX_SAFE_INTEGER;
      
      // Check if we need a refresh based on intervals
      const needsRefresh = !lastFetched || timeSinceLastFetch > REFRESH_INTERVAL;
      const allowedToRefresh = timeSinceLastFetch > MINIMUM_REFRESH_INTERVAL;
      
      if ((posts.length === 0 || (needsRefresh && allowedToRefresh))) {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`PostsLoadingControl: Fetching posts (${new Date().toLocaleTimeString()})`);
        }
        fetchPosts();
      }
    }
  }, [isWallOfLovePage, posts.length, lastFetched, fetchPosts, loading]);

  // This component doesn't render anything visible
  return null;
} 