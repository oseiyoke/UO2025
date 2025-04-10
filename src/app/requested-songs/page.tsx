'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeartLogo from '../components/HeartLogo';
import { supabase } from '@/lib/supabase';

type SongRequest = {
  id: string;
  song_title: string;
  artist: string;
  album?: string;
  album_art?: string;
  song_url?: string;
  requester_name: string;
  created_at: string;
};

export default function RequestedSongsPage() {
  const [songRequests, setSongRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSongRequests();
  }, []);

  const fetchSongRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongRequests(data || []);
    } catch (err) {
      console.error('Error fetching song requests:', err);
      setError('Failed to load song requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Display confirmation dialog before proceeding
    if (!window.confirm('Are you sure you want to delete this song request?')) {
      return; // Stop if the user cancels
    }

    try {
      console.log('Deleting song request:', id);
      setDeletingId(id);
      const { data, error } = await supabase
        .from('song_requests')
        .delete()
        .eq('id', id);
        console.log("here's the message, ", data)

      // Only update local state if the database deletion was successful
      if (error) {
        throw error; // Throw the error to be caught by the catch block
      } else {
        console.log("here's the message, ", data)
        // Update local state *after* successful deletion
        setSongRequests(prev => prev.filter(song => song.id !== id));
        // Optionally clear any existing error message upon success
        setError(null);
      }
    } catch (err) {
      console.error('Error deleting song request:', err);
      // Display a more specific error message if possible
      const message = (err instanceof Error && err.message) ? err.message : 'Unknown error';
      setError(`Failed to delete song request: ${message}. Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/" className="inline-block mb-6">
          <div className="flex items-center text-[#7C9270] hover:text-[#5A6851] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </div>
        </Link>
        
        <div className="text-center mb-8">
          <div className="mb-6">
            <HeartLogo width={100} height={100} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#7C9270] mb-2">Requested Songs</h1>
          <p className="text-gray-800">Manage song requests for the wedding</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-[#7C9270]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : songRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No song requests yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {songRequests.map((request) => (
                <div key={request.id} className="flex items-center p-4 border-b border-gray-100 last:border-b-0">
                  {request.album_art ? (
                    <img 
                      src={request.album_art} 
                      alt={`${request.song_title} album art`}
                      className="w-12 h-12 rounded mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded mr-4 bg-gray-200 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{request.song_title}</div>
                    <div className="text-sm text-gray-600">{request.artist}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Requested by {request.requester_name || 'Anonymous'} • {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(request.id)}
                    disabled={deletingId === request.id}
                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                    aria-label="Delete song request"
                  >
                    {deletingId === request.id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 