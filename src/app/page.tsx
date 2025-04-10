'use client';

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import InstallApp, { InstallAppRef } from "./components/InstallApp";
import HeartLogo from "./components/HeartLogo";

export default function Home() {
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

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full"></div>
        
        <main className="w-full flex flex-col gap-[24px] items-center sm:items-center max-w-4xl self-center">
          {/* Logo centered above the title */}
          <div className="my-4">
            <HeartLogo width={120} height={120} />
          </div>
          <h1 className="text-4xl font-bold text-center text-[#7C9270]">Unwana &amp; Obose &apos;s Wedding</h1>
          <p className="text-xl text-center text-gray-700 mb-1">We&apos;re getting married! Join us for our special day.</p>
          <a 
            href="https://www.instagram.com/explore/tags/uo2025/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-lg font-semibold text-[#7C9270] hover:text-[#5A6851] transition-colors"
          >
            <span className="flex text-pink-600 gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
              #UO2025
            </span>
          </a>
          
          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-10 mt-6">
            <Link href="/program?event=0">
              <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 mb-4">
                <div className="bg-[#7C9270] rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">View Program</h3>
                  <p className="text-gray-600 text-sm">See event schedule and details</p>
                </div>
              </div>
            </Link>
            
           
            <Link href="/request-song">
              <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="bg-purple-500 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Request Song</h3>
                  <p className="text-gray-600 text-sm">Ask the DJ to play your favorite</p>
                </div>
              </div>
            </Link>
          </div>
          
          {!isPWA && (
            <div className="w-full max-w-sm mt-8">
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
      </div>
    </div>
  );
}
