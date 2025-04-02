import React from 'react';
import Image from 'next/image';

interface HeartLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function HeartLogo({ className = '', width = 60, height = 60 }: HeartLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image 
        src="/wedding-logo/UO2025.png" 
        alt="Obose & Unwana Wedding Logo" 
        width={width} 
        height={height}
        className="object-contain transition-opacity hover:opacity-90"
        priority
      />
    </div>
  );
} 