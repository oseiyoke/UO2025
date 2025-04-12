'use client';

import { useState, useRef, useEffect } from 'react';
import HeartLogo from '../components/HeartLogo';
import { supabase } from '@/lib/supabase';
import { usePosts } from '../context/PostsContext';

export default function WallOfLovePage() {
  const { posts, setPosts, loading, fetchPosts } = usePosts();

  // State for post creation flow
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxFilesAlert, setMaxFilesAlert] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Track individual file upload progress
  const [fileUploadStatus, setFileUploadStatus] = useState<{
    index: number;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
  }[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [postSlides, setPostSlides] = useState<Record<string, number>>({});

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle expanded state for a post
  const toggleExpanded = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Navigate post slides
  const navigatePostSlide = (postId: string, direction: 'next' | 'prev') => {
    setPostSlides(prev => {
      const currentIndex = prev[postId] || 0;
      const post = posts.find(p => p.id.toString() === postId);
      
      if (!post) return prev;
      
      const totalSlides = 1 + (post.additional_media ? post.additional_media.length : 0);
      
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      
      // Handle wrap-around
      if (newIndex < 0) newIndex = totalSlides - 1;
      if (newIndex >= totalSlides) newIndex = 0;
      
      return {
        ...prev,
        [postId]: newIndex
      };
    });
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Limit to max 10 files
      const MAX_FILES = 10;
      const fileArray = Array.from(files);
      
      // Show alert if more than MAX_FILES files were selected
      if (fileArray.length > MAX_FILES) {
        setMaxFilesAlert(true);
        setTimeout(() => setMaxFilesAlert(false), 5000); // Hide alert after 5 seconds
      }
      
      // Only take the first MAX_FILES files
      const limitedFiles = fileArray.slice(0, MAX_FILES);
      setSelectedFiles(limitedFiles);
      
      // Generate previews
      const newPreviewUrls: string[] = [];
      let processedCount = 0;
      
      limitedFiles.forEach(file => {
        // For HEIC files, we'll use the file name for now and generate a proper preview later
        if (file.name.toLowerCase().endsWith('.heic')) {
          newPreviewUrls.push(''); // Placeholder for HEIC files
          processedCount++;
          
          if (processedCount === limitedFiles.length) {
            setPreviewUrls(newPreviewUrls);
          }
          return;
        }
        
        // Process image files
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            newPreviewUrls.push(reader.result as string);
            processedCount++;
            
            if (processedCount === limitedFiles.length) {
              setPreviewUrls(newPreviewUrls);
            }
          };
          reader.readAsDataURL(file);
          return;
        }
        
        // Process video files
        if (file.type.startsWith('video/')) {
          // Create a video thumbnail or use a placeholder
          const videoUrl = URL.createObjectURL(file);
          newPreviewUrls.push(videoUrl);
          processedCount++;
          
          if (processedCount === limitedFiles.length) {
            setPreviewUrls(newPreviewUrls);
          }
          return;
        }
        
        // Unrecognized file type
        newPreviewUrls.push(''); // Use empty placeholder
        processedCount++;
        
        if (processedCount === limitedFiles.length) {
          setPreviewUrls(newPreviewUrls);
        }
      });
      
      // Open modal after selection
      setIsModalOpen(true);
    }
  };

  // Convert HEIC file to JPEG
  const convertHEICtoJPEG = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // If not a HEIC file, return the original file
      if (!file.name.toLowerCase().endsWith('.heic')) {
        resolve(file);
        return;
      }
      
      try {
        // Create a new File object with a changed extension for display purposes
        const renamedFile = new File([file], file.name.replace(/\.heic$/i, '.jpg'), {
          type: 'image/jpeg',
          lastModified: file.lastModified
        });
        
        resolve(renamedFile);
      } catch (error) {
        console.error('Error converting HEIC file:', error);
        // If conversion fails, return the original file
        resolve(file);
      }
    });
  };

  // Optimize image before upload
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise(async (resolve) => {
      // First, convert HEIC to JPEG if needed
      const processedFile = await convertHEICtoJPEG(file);
      
      // If file's not an image or we can't process it in browser, return as is
      if (!processedFile.type.startsWith('image/')) {
        resolve(processedFile);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max dimensions for compressed images
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        let width = img.width;
        let height = img.height;
        
        // Maintain aspect ratio while resizing
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob with reduced quality
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a new file from the blob - always use jpg for maximum compatibility
            const fileName = processedFile.name.replace(/\.(heic|png|gif|webp)$/i, '.jpg');
            const optimizedFile = new File([blob], fileName, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            resolve(processedFile);
          }
        }, 'image/jpeg', 0.7); // 70% quality
      };
      
      img.onerror = () => {
        // If we can't load the image for some reason, return the original
        console.warn(`Could not process image: ${processedFile.name}`);
        resolve(processedFile);
      };
      
      img.src = URL.createObjectURL(processedFile);
    });
  };

  // Open file picker
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      
      // Initialize file upload status for each file
      const initialStatus = selectedFiles.map((file, index) => ({
        index,
        fileName: file.name,
        progress: 0,
        status: 'pending' as const
      }));
      setFileUploadStatus(initialStatus);
      
      const mediaUrls: string[] = [];
      
      // Process files one by one sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        try {
          // Update status to show we're working on this file
          setFileUploadStatus(prev => {
            const newStatus = [...prev];
            newStatus[i] = {...newStatus[i], status: 'uploading', progress: 10};
            return newStatus;
          });
          
          // For images, optimize them. For videos, use as is.
          let processedFile = file;
          if (file.type.startsWith('image/')) {
            // Step 1: Optimize the image
            setFileUploadStatus(prev => {
              const newStatus = [...prev];
              newStatus[i] = {...newStatus[i], progress: 20, status: 'uploading'};
              return newStatus;
            });
            
            processedFile = await optimizeImage(file);
          }
          
          // Step 2: Upload begins
          setFileUploadStatus(prev => {
            const newStatus = [...prev];
            newStatus[i] = {...newStatus[i], progress: 40, status: 'uploading'};
            return newStatus;
          });
          
          // Create a unique filename
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
          const filePath = `wall-of-love/${fileName}`;
          
          // Step 3: Actual upload to Supabase storage
          const { error: uploadError } = await supabase
            .storage
            .from('wall-of-love')
            .upload(filePath, processedFile);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            setFileUploadStatus(prev => {
              const newStatus = [...prev];
              newStatus[i] = {...newStatus[i], status: 'error', progress: 0};
              return newStatus;
            });
            continue;
          }
          
          // Step 4: Getting public URL
          setFileUploadStatus(prev => {
            const newStatus = [...prev];
            newStatus[i] = {...newStatus[i], progress: 80, status: 'uploading'};
            return newStatus;
          });
          
          // Get the public URL
          const { data: publicUrlData } = supabase
            .storage
            .from('wall-of-love')
            .getPublicUrl(filePath);
            
          mediaUrls.push(publicUrlData.publicUrl);
          
          // Step 5: Upload complete
          setFileUploadStatus(prev => {
            const newStatus = [...prev];
            newStatus[i] = {...newStatus[i], status: 'complete', progress: 100};
            return newStatus;
          });
          
          // Update overall progress
          setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
          
        } catch (error) {
          console.error(`Error with file ${file.name}:`, error);
          setFileUploadStatus(prev => {
            const newStatus = [...prev];
            newStatus[i] = {...newStatus[i], status: 'error', progress: 0};
            return newStatus;
          });
        }
      }
      
      if (mediaUrls.length === 0) {
        throw new Error('No files were successfully uploaded');
      }
      
      // Create a new post
      const { data: newPostData, error: postError } = await supabase
        .from('posts')
        .insert([
          {
            author: authorName || 'Anonymous',
            message: '', // No message
            image_url: mediaUrls[0], // First image as the primary image
            additional_media: mediaUrls.length > 1 ? mediaUrls.slice(1) : null,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (postError) {
        console.error('Error inserting post:', postError);
        return;
      }

      // Update posts in context
      if (newPostData && newPostData.length > 0) {
        const updatedPosts = [...newPostData, ...posts];
        setPosts(updatedPosts);
      } else {
        fetchPosts();
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setIsModalOpen(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setAuthorName('');
    setUploadProgress(0);
    setFileUploadStatus([]);
    setCurrentSlide(0);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Track visible media for optimization
  const [visibleMedias, setVisibleMedias] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const mediaId = entry.target.getAttribute('data-media-id');
            if (mediaId) {
              setVisibleMedias(prev => new Set([...prev, mediaId]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const mediaElements = document.querySelectorAll('.media-placeholder');
    mediaElements.forEach(el => observer.observe(el));

    return () => {
      mediaElements.forEach(el => observer.unobserve(el));
    };
  }, [posts]);

  // Render media function
  const renderMedia = (url: string, postId?: string, isPreview = false) => {
    const mediaId = url;
    const isVisible = visibleMedias.has(mediaId) || isPreview || (postId && expandedPosts[postId]);
    
    if (!isVisible && !isPreview) {
      return (
        <div 
          className="media-placeholder bg-gray-100 rounded-md flex items-center justify-center min-h-[200px]"
          data-media-id={mediaId}
        >
          <div className="animate-pulse">Loading media...</div>
        </div>
      );
    }
    
    // Check if this is a video URL
    const isVideo = isPreview 
      ? (url && url.startsWith('blob:') && selectedFiles.find((f, i) => previewUrls[i] === url)?.type.startsWith('video/'))
      : url.match(/\.(mp4|webm|ogg|mov)$/i);
    
    if (isVideo) {
      return (
        <video 
          src={url}
          controls
          className="w-full h-full object-cover rounded-md"
          preload="metadata"
        />
      );
    }
    
    // Default to image
    return (
      <img 
        src={url}
        alt="Shared memory" 
        className="w-full h-full object-cover rounded-md"
        loading="lazy"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-20">
      <div className="max-w-4xl mx-auto p-6">
        {/* Alert for max files exceeded */}
        {maxFilesAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded z-50 shadow-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
              </svg>
              <p>Maximum 10 files allowed. Only the first 10 files will be used.</p>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <div className="mb-6">
            <HeartLogo width={100} height={100} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#7C9270] mb-2">Wall of Love</h1>
          <p className="text-gray-800">Share your photos with the happy couple</p>
          <a 
            href="https://www.instagram.com/explore/tags/uo2025/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors justify-center mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
            </svg>
            #UO2025
          </a>
        </div>
        
        {/* Share Photo Button */}
        <div className="mb-8 flex justify-center">
          <button 
            onClick={openFilePicker}
            className="bg-[#7C9270] hover:bg-[#5A6851] text-white rounded-full p-5 shadow-lg transition-all hover:scale-105 active:scale-95"
            aria-label="Share photos and videos"
          >
            <div className="flex items-center space-x-2">
              {/* Camera icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {/* Video camera icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </button>
          
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*,video/*,.heic"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        
        {/* Photo Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Share Your Photos & Videos</h3>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600 text-sm">Maximum 10 files allowed per upload.</p>
                  <span className="text-sm font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {selectedFiles.length}/10 files
                  </span>
                </div>
                
                {previewUrls.length > 0 ? (
                  <div className="mb-4">
                    {/* Carousel container */}
                    <div className="relative">
                      {/* Main carousel slide */}
                      <div className="relative mb-2 h-[250px] bg-gray-100 rounded-md overflow-hidden">
                        {previewUrls[currentSlide] ? (
                          <div className="h-full">
                            {renderMedia(previewUrls[currentSlide], undefined, true)}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center p-4">
                              <p className="text-gray-500 text-sm mb-1">
                                {selectedFiles[currentSlide]?.name || 'Media file'}
                              </p>
                              <p className="text-xs text-gray-400">Preview not available</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Slide counter */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1">
                          {currentSlide + 1} / {previewUrls.length}
                        </div>
                        
                        {/* Upload status overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-2">
                            {fileUploadStatus[currentSlide]?.status === 'pending' && (
                              <span className="text-white text-xs font-medium">Waiting...</span>
                            )}
                            
                            {fileUploadStatus[currentSlide]?.status === 'uploading' && (
                              <>
                                <div className="w-full max-w-[80%] bg-gray-200 rounded-full h-2 mb-1">
                                  <div 
                                    className="bg-[#7C9270] h-2 rounded-full" 
                                    style={{ width: `${fileUploadStatus[currentSlide]?.progress || 0}%` }}
                                  />
                                </div>
                                <span className="text-white text-xs font-medium">
                                  {
                                    fileUploadStatus[currentSlide]?.progress <= 20 ? 'Converting...' :
                                    fileUploadStatus[currentSlide]?.progress <= 40 ? 'Preparing...' :
                                    fileUploadStatus[currentSlide]?.progress <= 80 ? 'Uploading...' :
                                    'Finishing...'
                                  }
                                </span>
                              </>
                            )}
                            
                            {fileUploadStatus[currentSlide]?.status === 'complete' && (
                              <div className="bg-green-500 text-white rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            
                            {fileUploadStatus[currentSlide]?.status === 'error' && (
                              <div className="bg-red-500 text-white rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Navigation arrows */}
                        {previewUrls.length > 1 && (
                          <>
                            <button 
                              onClick={() => setCurrentSlide(prev => (prev === 0 ? previewUrls.length - 1 : prev - 1))}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 focus:outline-none"
                              disabled={isUploading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => setCurrentSlide(prev => (prev === previewUrls.length - 1 ? 0 : prev + 1))}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 focus:outline-none"
                              disabled={isUploading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Thumbnail navigation */}
                      {previewUrls.length > 1 && (
                        <div className="flex overflow-x-auto space-x-2 pb-2 max-w-full">
                          {previewUrls.map((url, index) => (
                            <div 
                              key={index} 
                              onClick={() => !isUploading && setCurrentSlide(index)}
                              className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-md overflow-hidden ${index === currentSlide ? 'ring-2 ring-[#7C9270]' : 'opacity-70'}`}
                            >
                              {url ? (
                                <div className="w-full h-full">
                                  {url.startsWith('blob:') && selectedFiles[index]?.type.startsWith('video/') ? (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <img 
                                      src={url} 
                                      alt={`Thumbnail ${index + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">{index + 1}</span>
                                </div>
                              )}
                              
                              {/* Status indicator dot */}
                              {fileUploadStatus[index] && (
                                <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full ${
                                  fileUploadStatus[index]?.status === 'complete' ? 'bg-green-500' :
                                  fileUploadStatus[index]?.status === 'error' ? 'bg-red-500' :
                                  fileUploadStatus[index]?.status === 'uploading' ? 'bg-yellow-500' :
                                  'bg-gray-500'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-gray-100 rounded-md text-center text-gray-500">
                    Processing media...
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-900 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="author"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C9270]"
                      placeholder="Enter your name (optional)"
                    />
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#7C9270] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {
                          uploadProgress < 100 
                            ? `Uploading media ${fileUploadStatus.findIndex(s => s.status === 'uploading') + 1} of ${selectedFiles.length}...` 
                            : 'Creating post...'
                        }
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#7C9270] text-white py-2 px-4 rounded-md hover:bg-[#5A6851] transition-colors"
                      disabled={isUploading || previewUrls.length === 0}
                    >
                      {isUploading ? 'Uploading...' : 'Share Media'}
                    </button>
                  </div>
                </form>
              </div>
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
            <p className="text-gray-600 mb-4">No photos or videos yet. Be the first to share!</p>
            <button 
              onClick={openFilePicker}
              className="bg-[#7C9270] text-white py-2 px-6 rounded-md hover:bg-[#5A6851] transition-colors flex items-center justify-center mx-auto space-x-2"
            >
              <span>Share Photos & Videos (Max 10)</span>
              <div className="flex items-center space-x-1">
                {/* Camera icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {/* Video camera icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </button>
          </div>
        )}
        
        {/* Wall of Posts */}
        {!loading && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map(post => {
              // Calculate total media count
              const mediaCount = 1 + (post.additional_media ? post.additional_media.length : 0);
              // Get all media URLs into one array
              const allMedia = post.image_url 
                ? [post.image_url, ...(post.additional_media || [])]
                : post.additional_media || [];
              // Get current slide index for this post
              const currentPostSlide = postSlides[post.id] || 0;
              
              return (
                <div key={post.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{post.author}</h3>
                      <p className="text-gray-800 text-sm">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  
                  {/* Media count indicator */}
                  <div className="mt-2 flex items-center space-x-2 mb-3">
                    <button 
                      onClick={() => toggleExpanded(post.id.toString())}
                      className="bg-[#7C9270] hover:bg-[#5A6851] text-white rounded-md px-3 py-1.5 text-sm flex items-center transition-colors"
                    >
                      {expandedPosts[post.id] ? 'Hide Media' : 'View Media'}
                    </button>
                    <span className="text-gray-600 text-sm">
                      {mediaCount} {mediaCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  
                  {/* Show media only when expanded */}
                  {expandedPosts[post.id] && (
                    <div className="mt-4">
                      {/* Carousel container */}
                      <div className="relative">
                        {/* Main carousel slide */}
                        <div className="relative overflow-hidden rounded-md h-[350px]">
                          {allMedia[currentPostSlide] && renderMedia(allMedia[currentPostSlide]!, post.id.toString())}
                          
                          {/* Slide counter */}
                          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1">
                            {currentPostSlide + 1} / {mediaCount}
                          </div>
                          
                          {/* Navigation arrows for multiple items */}
                          {mediaCount > 1 && (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigatePostSlide(post.id.toString(), 'prev');
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 focus:outline-none"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigatePostSlide(post.id.toString(), 'next');
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 focus:outline-none"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                        
                        {/* Thumbnail navigation for multiple items */}
                        {mediaCount > 1 && (
                          <div className="flex overflow-x-auto space-x-2 mt-2 pb-2">
                            {allMedia.map((url, index) => (
                              <div 
                                key={index} 
                                onClick={() => setPostSlides({...postSlides, [post.id]: index})}
                                className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-md overflow-hidden ${
                                  index === currentPostSlide ? 'ring-2 ring-[#7C9270]' : 'opacity-70'
                                }`}
                              >
                                <div className="w-full h-full">
                                  {url && url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <img 
                                      src={url} 
                                      alt={`Thumbnail ${index + 1}`} 
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 