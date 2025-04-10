'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import HeartLogo from '../components/HeartLogo';
import { supabase } from '@/lib/supabase';

type Song = {
  id: string;
  song_title: string;
  artist: string;
  album?: string;
  album_art?: string;
  song_url?: string;
  requester_name: string;
  created_at: string;
  upvotes: number;
};

// Type for ranked songs from database
type RankedSong = {
  id: string;
  song_title: string;
  artist: string;
  album?: string;
  album_art?: string;
  song_url?: string;
  requester_name: string;
  created_at: string;
  upvotes: number;
};

// iTunes API response type
type iTunesResponse = {
  results: {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    trackViewUrl: string;
    previewUrl?: string;
  }[];
};

export default function RequestSongPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [requesterName, setRequesterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rankedSongs, setRankedSongs] = useState<RankedSong[]>([]);
  const [isLoadingRankedSongs, setIsLoadingRankedSongs] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  // Fetch ranked songs on component mount
  useEffect(() => {
    fetchRankedSongs();
  }, []);

  // Refetch ranked songs after successful submission
  useEffect(() => {
    if (isSuccess) {
      fetchRankedSongs();
    }
  }, [isSuccess]);

  // Function to fetch ranked songs from database
  const fetchRankedSongs = async () => {
    setIsLoadingRankedSongs(true);
    try {
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .order('upvotes', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRankedSongs(data || []);
    } catch (err) {
      console.error('Error fetching ranked songs:', err);
      setError('Failed to load songs. Please try again later.');
    } finally {
      setIsLoadingRankedSongs(false);
    }
  };

  // Search songs using iTunes Search API
  const searchSongs = async (query: string): Promise<Song[]> => {
    if (!query.trim()) return [];
    
    try {
      // Encode the search query for URL
      const encodedQuery = encodeURIComponent(query);
      
      // Make request to iTunes Search API
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`iTunes API responded with status: ${response.status}`);
      }
      
      const data = await response.json() as iTunesResponse;
      
      // Map iTunes results to our Song interface
      return mapiTunesResultsToSongs(data);
    } catch (err) {
      console.error('Error searching iTunes API:', err);
      return [];
    }
  };

  const mapiTunesResultsToSongs = (data: iTunesResponse): Song[] => {
    return data.results.map(item => ({
      id: item.trackId.toString(),
      song_title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      album_art: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : undefined,
      song_url: item.previewUrl || item.trackViewUrl,
      requester_name: '',
      created_at: new Date().toISOString(),
      upvotes: 0
    }));
  };

  // Handle search input changes
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchSongs(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching for songs:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSong) {
      setError('Please select a song');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error: submitError } = await supabase
        .from('song_requests')
        .insert([
          {
            song_title: selectedSong.song_title,
            artist: selectedSong.artist,
            album: selectedSong.album || '',
            album_art: selectedSong.album_art || '',
            song_url: selectedSong.song_url || '',
            requester_name: requesterName || 'Anonymous',
            upvotes: 0,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (submitError) {
        throw submitError;
      }
      
      // Clear form and show success message
      setSelectedSong(null);
      setRequesterName('');
      setIsSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting song request:', err);
      setError('Failed to submit song request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to play/pause audio preview
  const togglePreview = (previewUrl: string) => {
    if (playingPreview === previewUrl) {
      // Pause current preview
      setPlayingPreview(null);
    } else {
      // Stop any currently playing preview and play the new one
      setPlayingPreview(previewUrl);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      setUpvotingId(id);
      const { data: song, error: fetchError } = await supabase
        .from('song_requests')
        .select('upvotes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('song_requests')
        .update({ upvotes: (song.upvotes || 0) + 1 })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setRankedSongs(prev => 
        prev.map(song => 
          song.id === id 
            ? { ...song, upvotes: (song.upvotes || 0) + 1 }
            : song
        ).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      );
    } catch (err) {
      console.error('Error upvoting song:', err);
      setError('Failed to upvote song. Please try again.');
    } finally {
      setUpvotingId(null);
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#7C9270] mb-2">Request a Song</h1>
          <p className="text-gray-800">Search for a song and request it for the wedding</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Request Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 md:mb-0">
            {isSuccess ? (
              <div className="text-center p-6">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Song Request Submitted!</h3>
                <p className="text-gray-600 mb-4">Thanks for your suggestion. Our DJ will try to play it during the celebration.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="inline-block bg-[#7C9270] hover:bg-[#5A6851] text-white rounded-lg px-6 py-2 transition-colors"
                >
                  Request Another Song
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Your Request</h3>
                
                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="songSearch" className="block text-gray-700 font-medium mb-2">
                    Search for a Song <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex items-center relative">
                      <input
                        type="text"
                        id="songSearch"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring focus:ring-[#7C9270]/20 focus:border-[#7C9270] outline-none transition"
                        placeholder="Search by song name or artist"
                        autoComplete="off"
                      />
                      {isSearching ? (
                        <div className="absolute right-3">
                          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <div className="absolute right-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div 
                        ref={resultsRef}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                      >
                        {searchResults.map((song) => (
                          <div 
                            key={song.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSongSelect(song)}
                          >
                            {song.album_art && (
                              <img 
                                src={song.album_art} 
                                alt={`${song.song_title} album art`}
                                className="w-10 h-10 rounded mr-3 object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-800">{song.song_title}</div>
                              <div className="text-sm text-gray-600">{song.artist}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedSong && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      {selectedSong.album_art && (
                        <img 
                          src={selectedSong.album_art} 
                          alt={`${selectedSong.song_title} album art`}
                          className="w-12 h-12 rounded mr-3 object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{selectedSong.song_title}</div>
                        <div className="text-sm text-gray-600">{selectedSong.artist}</div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSelectedSong(null)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Remove selected song"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="requesterName" className="block text-gray-700 font-medium mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    id="requesterName"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#7C9270]/20 focus:border-[#7C9270] outline-none transition"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedSong}
                    className={`w-full bg-[#7C9270] hover:bg-[#5A6851] text-white font-medium py-3 px-6 rounded-lg transition-colors ${(isSubmitting || !selectedSong) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Song Request'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Most Requested Songs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Requested Songs</h3>
            
            {isLoadingRankedSongs ? (
              <div className="flex justify-center items-center py-8">
                <svg className="animate-spin h-8 w-8 text-[#7C9270]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : rankedSongs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No song requests yet. Be the first to request a song!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rankedSongs.map((song) => (
                  <div key={song.id} className="flex items-start p-3 border-b border-gray-100 last:border-b-0 gap-3">
                    {/* Album Art / Placeholder */}
                    {song.album_art ? (
                      <div className="relative flex-shrink-0 w-12 h-12">
                        <img 
                          src={song.album_art} 
                          alt={`${song.song_title} album art`}
                          className="w-full h-full rounded object-cover"
                        />
                        {song.song_url && (
                          <button
                            onClick={() => togglePreview(song.song_url!)}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded hover:bg-opacity-40 transition-opacity"
                            aria-label={playingPreview === song.song_url ? "Pause preview" : "Play preview"}
                          >
                            {playingPreview === song.song_url ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Song Info & Requester */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">{song.song_title}</div>
                      <div className="text-sm text-gray-600 truncate">{song.artist}</div>
                      <div className="mt-1 bg-purple-100 rounded-full px-2 py-0.5 inline-block text-xs text-purple-700 font-medium">
                        Requested by {song.requester_name || 'Anonymous'} • {new Date(song.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvote(song.id)}
                      disabled={upvotingId === song.id}
                      className="flex flex-col items-center flex-shrink-0 text-[#7C9270] hover:text-[#5A6851] transition-colors disabled:opacity-50 pt-1"
                      aria-label="Upvote song"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-sm font-medium mt-0.5">{song.upvotes || 0}</span>
                    </button>
                  </div>
                ))}
                
                {/* Audio element for playing previews */}
                {playingPreview && (
                  <audio
                    src={playingPreview}
                    autoPlay
                    onEnded={() => setPlayingPreview(null)}
                    className="hidden"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm mt-8">
          <p>
            Songs will be played based on availability and suitability for the event.<br />
            Our DJ will do their best to include your request in the playlist.
          </p>
        </div>
      </div>
    </div>
  );
} 