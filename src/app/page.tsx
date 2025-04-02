'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import InstallApp, { InstallAppRef } from "./components/InstallApp";
import HeartLogo from "./components/HeartLogo";

export default function Home() {
  // Event data for the carousel
  const events = [
    {
      id: 1,
      day: "Friday",
      date: "April 11, 2025",
      name: "Traditional Wedding",
      time: "12:00 PM",
      venue: "Jacksville Event Center",
      location: "Uyo, Nigeria",
      mapUrl: "https://maps.google.com/?q=Jacksville+Event+Center+Uyo+Nigeria"
    },
    {
      id: 2,
      day: "Friday",
      date: "April 11, 2025",
      name: "Cocktail Night",
      time: "7:00 PM",
      venue: "Chalis Apartments",
      location: "Uyo, Nigeria",
      mapUrl: "https://maps.google.com/?q=Chalis+Apartments+Uyo+Nigeria"
    },
    {
      id: 3,
      day: "Saturday",
      date: "April 12, 2025",
      name: "Wedding Ceremony",
      time: "1:00 PM",
      venue: "Flairmore Event Center",
      location: "Uyo, Nigeria",
      mapUrl: "https://maps.google.com/?q=Flairmore+Event+Center+Uyo+Nigeria"
    },
    {
      id: 4,
      day: "Sunday",
      date: "April 13, 2025",
      name: "Beach Day",
      time: "2:00 PM",
      venue: "Ibeno Beach",
      location: "Ibeno, Nigeria",
      mapUrl: "https://maps.google.com/?q=Ibeno+Beach+Nigeria"
    }
  ];

  const [activeEvent, setActiveEvent] = useState(0); // Traditional wedding is default
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPWA, setIsPWA] = useState(false);

  // Ref for the InstallApp component
  const installAppRef = useRef<InstallAppRef>(null);

  // Check if app is running as PWA
  useEffect(() => {
    // Check if the app is installed as PWA (in standalone mode or display-mode is standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone) || 
                        document.referrer.includes('android-app://');
    setIsPWA(isStandalone);
  }, []);

  // Handle swipe functionality
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const difference = touchStartX.current - touchEndX.current;
      
      // Minimum swipe distance (pixels)
      if (Math.abs(difference) < 50) return;
      
      if (difference > 0) {
        // Swipe left - next event
        setActiveEvent(prev => (prev < events.length - 1 ? prev + 1 : prev));
      } else {
        // Swipe right - previous event
        setActiveEvent(prev => (prev > 0 ? prev - 1 : prev));
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart);
      carousel.addEventListener('touchmove', handleTouchMove);
      carousel.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchmove', handleTouchMove);
        carousel.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [events.length]);

  // Handle click on location to open Google Maps
  const handleLocationClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="h-full grid grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* Logo in the top left */}
        <div className="absolute top-6 left-6">
          <HeartLogo />
        </div>
        
        <div className="w-full"></div>
        
        <main className="w-full flex flex-col gap-[24px] items-center sm:items-center max-w-4xl self-center">
          <h1 className="text-4xl font-bold text-center text-gray-800">Obose &amp; Unwana&apos;s Wedding</h1>
          <p className="text-xl text-center text-gray-700 mb-1">We&apos;re getting married! Join us for our special day.</p>
          <a 
            href="https://www.instagram.com/explore/tags/uo2025/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-lg font-semibold text-pink-600 hover:text-pink-800 transition-colors"
          >
            <span className="flex gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
              #UO2025
            </span>
          </a>
          
          {/* Event Carousel */}
          <div className="w-full max-w-md" ref={carouselRef}>
            <div className="flex justify-center mb-4">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  onClick={() => setActiveEvent(index)}
                  className={`w-2 h-2 mx-1 rounded-full ${activeEvent === index ? 'bg-pink-600' : 'bg-gray-300'}`}
                  aria-label={`View ${event.name} details`}
                />
              ))}
            </div>
            
            <Link href={`/program?event=${activeEvent}`}>
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <p className="text-sm font-medium text-pink-600 mb-1">{events[activeEvent].day}</p>
                <p className="text-lg font-bold text-gray-800 mb-2">{events[activeEvent].name}</p>
                <p className="text-lg text-gray-800">{events[activeEvent].date}</p>
                <p className="text-lg text-gray-800">{events[activeEvent].time}</p>
                <p className="text-lg text-gray-800">{events[activeEvent].venue}</p>
                <span 
                  onClick={(e) => handleLocationClick(e, events[activeEvent].mapUrl)}
                  className="text-lg text-blue-600 hover:underline cursor-pointer"
                >
                  {events[activeEvent].location}
                </span>
              </div>
            </Link>
            <p className="text-xs text-center mt-3 text-gray-500">Swipe or tap dots to change events • Tap card for details</p>
          </div>
          
          {!isPWA && (
            <div className="w-full max-w-sm">
              <button 
                onClick={() => {
                  // Use the ref to trigger installation
                  if (installAppRef.current) {
                    console.log('Triggering app install from button');
                    installAppRef.current.triggerInstall();
                  } else {
                    console.error('InstallApp ref not available');
                  }
                }}
                className="rounded-full border border-solid border-pink-600 text-pink-600 transition-colors flex items-center justify-center hover:bg-pink-50 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
              >
                Download App
              </button>
            </div>
          )}
          
          <div>
            <InstallApp ref={installAppRef} />
          </div>
        </main>
        <footer className="text-center mt-auto w-full">
          <p className="text-sm text-gray-600">Made with love by the happy couple</p>
        </footer>
      </div>
      
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center text-pink-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/program?event=0" className="flex flex-col items-center text-gray-600 hover:text-pink-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Program</span>
        </Link>
        
        <Link href="/wall-of-love" className="flex flex-col items-center text-gray-600 hover:text-pink-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs mt-1">Wall of Love</span>
        </Link>
      </nav>
    </div>
  );
}
