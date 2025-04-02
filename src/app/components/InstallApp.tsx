'use client';

import { useState, useEffect } from 'react';

// Define type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallApp() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    setIsIOS(iOS);
    
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as { standalone?: boolean }).standalone;
    
    if (isStandalone) {
      return; // Already installed, no need to show installation instructions
    }

    // For Chrome/Edge/Android, listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    });

    // Cleanup function
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Reset the deferredPrompt variable
    setDeferredPrompt(null);
    setIsInstallable(false);
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  return (
    <div className="">
      {isInstallable && (
        <button 
          onClick={handleInstallClick}
          className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors w-full"
        >
          Install Wedding App
        </button>
      )}

      {!isInstallable && (
        <button 
          onClick={() => setShowInstructions(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors w-full"
          data-install="true"
        >
          Download App
        </button>
      )}

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">App Installation Instructions</h3>
            
            {isIOS ? (
              <div className="space-y-4">
                <p className="font-semibold text-gray-800">For iOS (iPhone & iPad):</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-800">
                  <li>Tap the Share button <span className="inline-block w-6 h-6 align-middle bg-gray-200 rounded-md text-center">⬆️</span> at the bottom of your screen</li>
                  <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                  <li>Tap &quot;Add&quot; in the top right corner</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-semibold text-gray-800">For Android:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-800">
                  <li>Tap the three dots menu ⋮ in the top right corner of your browser</li>
                  <li>Tap &quot;Add to Home screen&quot;</li>
                  <li>Tap &quot;Add&quot; when prompted</li>
                </ol>
              </div>
            )}
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="mt-6 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 