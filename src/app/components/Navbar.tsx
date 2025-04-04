'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Determine which nav item is active based on the current path
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path === '/program' && pathname.startsWith('/program')) return true;
    if (path === '/wall-of-love' && pathname === '/wall-of-love') return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 pb-6 md:pb-4 safe-bottom">
      <div className="grid grid-cols-3 w-full max-w-md mx-auto">
        <Link href="/" className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-[#7C9270]' : 'text-gray-800 hover:text-[#7C9270]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1 mb-4">Home</span>
        </Link>
        
        <Link href="/program?event=0" className={`flex flex-col items-center justify-center ${isActive('/program') ? 'text-[#7C9270]' : 'text-gray-800 hover:text-[#7C9270]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1 mb-4">Program</span>
        </Link>
        
        <Link href="/wall-of-love" className={`flex flex-col items-center justify-center ${isActive('/wall-of-love') ? 'text-[#7C9270]' : 'text-gray-800 hover:text-[#7C9270]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs mt-1 mb-4">Wall of Love</span>
        </Link>
      </div>
    </nav>
  );
} 