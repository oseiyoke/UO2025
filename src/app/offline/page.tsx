import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-md w-full text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">You&apos;re Offline</h1>
        <p className="mb-6 text-gray-600">
          It looks like you&apos;re currently offline. Some features may not be available until you reconnect.
        </p>
        <p className="mb-6 text-gray-600">
          Don&apos;t worry! You can still access previously viewed pages.
        </p>
        <Link
          href="/"
          className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
} 