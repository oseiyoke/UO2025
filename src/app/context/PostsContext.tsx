'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface Post {
  id: number;
  author: string;
  message: string;
  image_url?: string;
  additional_media?: string[];
  created_at: string;
}

interface PostsContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  loading: boolean;
  fetchPosts: () => Promise<void>;
  lastFetched: number | null;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // Fetch posts from the database - Wrapped in useCallback to prevent unnecessary re-renders
  const fetchPosts = useCallback(async () => {
    // Avoid duplicate fetches
    if (loading) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
        setLastFetched(Date.now());
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <PostsContext.Provider value={{ posts, setPosts, loading, fetchPosts, lastFetched }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
} 