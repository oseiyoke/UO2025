'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

// Define type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type DeviceType = 'desktop' | 'android' | 'ios' | 'other';

// Define the ref interface
export interface InstallAppRef {
  triggerInstall: () => Promise<void>;
  showInstructions: () => void;
  getDeviceType: () => DeviceType;
}

// Define props type
type InstallAppProps = Record<string, never>;

const InstallApp = forwardRef<InstallAppRef, InstallAppProps>((props, ref) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    triggerInstall: async () => {
      console.log(`Triggering install for device type: ${deviceType}`);
      
      if (deviceType === 'android' && deferredPrompt) {
        // For Android devices with available install prompt, trigger installation directly
        try {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          setDeferredPrompt(null);
          
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsInstalled(true);
          } else {
            console.log('User dismissed the install prompt');
            // If user dismisses native prompt, show instructions as fallback
            setShowInstructions(true);
          }
        } catch (error) {
          console.error('Installation error:', error);
          setShowInstructions(true);
        }
      } else if (deferredPrompt) {
        // For non-Android devices with available install prompt
        try {
          // Show the instructions first
          setShowInstructions(true);
          // Keep the deferredPrompt available for later use if needed
        } catch (error) {
          console.error('Installation error:', error);
          setShowInstructions(true);
        }
      } else {
        // For all other devices without installation prompt
        console.log('Showing installation instructions');
        setShowInstructions(true);
      }
    },
    showInstructions: () => setShowInstructions(true),
    getDeviceType: () => deviceType
  }));

  useEffect(() => {
    // Detect device type
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isMobile = isIOS || isAndroid || /mobile/i.test(ua);
    
    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else if (!isMobile) {
      setDeviceType('desktop');
    } else {
      setDeviceType('other');
    }
    
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone) ||
                        document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);
    
    // For Chrome/Edge/Android, listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('Captured beforeinstallprompt event');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Don't render visible UI if app is installed
  if (isInstalled) {
    return null;
  }

  return (
    <div>
      {/* Installation instructions modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">App Installation Instructions</h3>
            
            {deviceType === 'ios' ? (
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
            
            <div className="mt-6 flex flex-col gap-3">
              {deferredPrompt && deviceType !== 'android' && (
                <button 
                  onClick={async () => {
                    if (deferredPrompt) {
                      try {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        setDeferredPrompt(null);
                        
                        if (outcome === 'accepted') {
                          console.log('User accepted the install prompt');
                          setIsInstalled(true);
                          setShowInstructions(false);
                        } else {
                          console.log('User dismissed the install prompt');
                        }
                      } catch (error) {
                        console.error('Installation error:', error);
                      }
                    }
                  }}
                  className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors w-full"
                >
                  Install Now
                </button>
              )}
              
              <button 
                onClick={() => setShowInstructions(false)}
                className={`${deferredPrompt && deviceType !== 'android' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-pink-600 text-white hover:bg-pink-700'} px-4 py-2 rounded-full transition-colors w-full`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

InstallApp.displayName = 'InstallApp';

export default InstallApp; 