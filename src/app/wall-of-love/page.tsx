'use client';

import { useState, useRef } from 'react';
import HeartLogo from '../components/HeartLogo';
import { supabase } from '@/lib/supabase';
import { usePosts } from '../context/PostsContext';

export default function WallOfLovePage() {
  const { posts, setPosts, loading, fetchPosts } = usePosts();

  // State for post creation flow
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'image' | 'details'>('image');
  const [newPost, setNewPost] = useState({
    author: '',
    message: '',
    image: null as File | null
  });

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      setNewPost({...newPost, image: file});
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
        // Move to the details step after selecting an image
        setStep('details');
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Open camera/photo library
  const openImagePicker = () => {
    setIsModalOpen(true);
    setStep('image');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission after adding details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl || !newPost.image) return;
    
    try {
      // Create the new post
      const filePath = `wall-of-love/${new Date().toISOString()}-${newPost.image.name}`;
      const { error: uploadError } = await supabase
        .storage
        .from('wall-of-love')
        .upload(filePath, newPost.image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }
      
      // Get the public URL for the image
      const { data: publicUrlData } = supabase
        .storage
        .from('wall-of-love')
        .getPublicUrl(filePath);
        
      const imageUrl = publicUrlData.publicUrl;

      const { data: newPostData, error: postError } = await supabase
        .from('posts')
        .insert([
          {
            author: newPost.author || 'Anonymous',
            message: newPost.message || 'Shared a moment!',
            image_url: imageUrl,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (postError) {
        console.error('Error inserting post:', postError);
        return;
      }

      // Instead of fetching all posts again, just update the context
      if (newPostData && newPostData.length > 0) {
        // New post should appear at the beginning of the list
        const updatedPosts = [...newPostData, ...posts];
        setPosts(updatedPosts);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Post added - updated in memory');
        }
      } else {
        // If we couldn't get the new post data, fetch all posts
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetching posts: after new post creation');
        }
        fetchPosts();
      }
      
      // Reset form
      setIsModalOpen(false);
      setStep('image');
      setNewPost({
        author: '',
        message: '',
        image: null
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Cancel post creation
  const handleCancel = () => {
    setIsModalOpen(false);
    setStep('image');
    setNewPost({
      author: '',
      message: '',
      image: null
    });
    setPreviewUrl(null);
  };

  // Function to format date from ISO string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto p-6 relative">
        <div className="text-center mb-8">
          <div className="mb-6">
            <HeartLogo width={100} height={100} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#7C9270] mb-2">Wall of Love</h1>
          <p className="text-gray-800">Share your wishes and memories with the happy couple</p>
          <a 
            href="https://www.instagram.com/explore/tags/uo2025/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-sm font-semibold text-[#7C9270] hover:text-[#5A6851] transition-colors justify-center mt-2"
          >
            <span className="flex text-pink-600 gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
              #UO2025
            </span>
          </a>
        </div>
        
        {/* Camera Button */}
        <div className="mb-8 flex justify-center">
          <button 
            onClick={openImagePicker}
            className="bg-[#7C9270] hover:bg-[#5A6851] text-white rounded-full p-5 shadow-lg transition-all hover:scale-105 active:scale-95"
            aria-label="Share a photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        
        {/* Image Selection Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              {step === 'image' ? (
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Choose an Image</h3>
                  <p className="text-gray-600 mb-4">Select or take a photo to share</p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Share Your Moment</h3>
                  
                  {previewUrl && (
                    <div className="mb-4">
                      <img 
                        src={previewUrl} 
                        alt="Selected" 
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-gray-900 mb-1">Your Name</label>
                      <input
                        type="text"
                        id="author"
                        value={newPost.author}
                        onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-1">Your Message</label>
                      <textarea
                        id="message"
                        value={newPost.message}
                        onChange={(e) => setNewPost({...newPost, message: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Write something nice..."
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#7C9270] text-white py-2 px-4 rounded-md hover:bg-[#5A6851] transition-colors"
                      >
                        Share
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7C9270]"></div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No posts yet. Be the first to share!</p>
            <button 
              onClick={openImagePicker}
              className="bg-[#7C9270] text-white py-2 px-6 rounded-md hover:bg-[#5A6851] transition-colors"
            >
              Share a Photo
            </button>
          </div>
        )}
        
        {/* Wall of Posts */}
        {!loading && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{post.author}</h3>
                    <p className="text-gray-800 text-sm">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                
                <p className="text-gray-900 mb-4">{post.message}</p>
                
                {post.image_url && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <img 
                      src={post.image_url}
                      alt={`Post by ${post.author}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 