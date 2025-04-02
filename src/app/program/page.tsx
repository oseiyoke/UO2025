'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import HeartLogo from '../components/HeartLogo';

function ProgramContent() {
  const searchParams = useSearchParams();
  const eventId = Number(searchParams.get('event') || '0'); // Default to traditional wedding event

  // Event headers information
  const eventHeaders = [
    {
      title: 'Traditional Wedding',
      date: 'Friday, April 11, 2025',
      venue: 'Jacksville Event Center',
      location: 'Uyo, Nigeria',
      mapUrl: 'https://maps.google.com/?q=Jacksville+Event+Center+Uyo+Nigeria'
    },
    {
      title: 'Cocktail Night',
      date: 'Friday, April 11, 2025',
      venue: 'Chalis Apartments',
      location: 'Uyo, Nigeria',
      mapUrl: 'https://maps.google.com/?q=Chalis+Apartments+Uyo+Nigeria'
    },
    {
      title: 'Wedding Ceremony',
      date: 'Saturday, April 12, 2025',
      venue: 'Flairmore Event Center',
      location: 'Uyo, Nigeria',
      mapUrl: 'https://maps.google.com/?q=Flairmore+Event+Center+Uyo+Nigeria'
    },
    {
      title: 'Beach Day',
      date: 'Sunday, April 13, 2025',
      venue: 'Ibeno Beach',
      location: 'Ibeno, Nigeria',
      mapUrl: 'https://maps.google.com/?q=Ibeno+Beach+Nigeria'
    }
  ];

  // Program data for different events
  const allProgramData = [
    // Traditional Wedding (Friday)
    [
      {
        id: 1,
        time: '12:00 PM',
        title: 'Guest Arrival',
        description: 'Guests arrive and are seated',
        location: 'Main Hall'
      },
      {
        id: 2,
        time: '12:30 PM',
        title: 'Traditional Ceremony',
        description: 'Traditional marriage rituals and customs',
        location: 'Main Hall'
      },
      {
        id: 3,
        time: '2:00 PM',
        title: 'Cultural Performances',
        description: 'Traditional dances and performances',
        location: 'Main Stage'
      },
      {
        id: 4,
        time: '3:00 PM',
        title: 'Feast',
        description: 'Traditional food and refreshments',
        location: 'Dining Area'
      },
      {
        id: 5,
        time: '5:00 PM',
        title: 'Closing',
        description: 'End of traditional ceremony',
        location: 'Main Hall'
      }
    ],
    // Cocktail Night (Friday evening)
    [
      {
        id: 1,
        time: '7:00 PM',
        title: 'Arrival & Welcome Drinks',
        description: 'Signature cocktails and appetizers',
        location: 'Lounge'
      },
      {
        id: 2,
        time: '7:30 PM',
        title: 'Social Hour',
        description: 'Mix and mingle with other guests',
        location: 'Outdoor Terrace'
      },
      {
        id: 3,
        time: '8:30 PM',
        title: 'Games & Entertainment',
        description: 'Fun activities for everyone',
        location: 'Main Area'
      },
      {
        id: 4,
        time: '10:00 PM',
        title: 'Dance Party',
        description: 'DJ playing all the hits',
        location: 'Dance Floor'
      },
      {
        id: 5,
        time: '12:00 AM',
        title: 'Event Conclusion',
        description: 'End of cocktail night',
        location: 'Main Entrance'
      }
    ],
    // Wedding Ceremony (Saturday)
    [
      {
        id: 1,
        time: '1:00 PM',
        title: 'Guest Arrival',
        description: 'Guests arrive and are seated',
        location: 'Main Hall'
      },
      {
        id: 2,
        time: '2:00 PM',
        title: 'Ceremony',
        description: 'Wedding ceremony begins',
        location: 'Event Hall'
      },
      {
        id: 3,
        time: '3:00 PM',
        title: 'Cocktail Hour',
        description: 'Drinks and appetizers served while wedding party takes photos',
        location: 'Garden Area'
      },
      {
        id: 4,
        time: '4:30 PM',
        title: 'Reception',
        description: 'Dinner, speeches, and dancing',
        location: 'Main Ballroom'
      },
      {
        id: 5,
        time: '10:00 PM',
        title: 'Send Off',
        description: 'Farewell to the newlyweds',
        location: 'Front Entrance'
      }
    ],
    // Beach Day (Sunday)
    [
      {
        id: 1,
        time: '2:00 PM',
        title: 'Arrival at Beach',
        description: 'Meet and greet at the beachfront',
        location: 'Main Beach Entrance'
      },
      {
        id: 2,
        time: '2:30 PM',
        title: 'Beach Activities',
        description: 'Games, swimming, and relaxation',
        location: 'Beach Area'
      },
      {
        id: 3,
        time: '4:00 PM',
        title: 'BBQ & Refreshments',
        description: 'Food and drinks served',
        location: 'Beach Pavilion'
      },
      {
        id: 4,
        time: '6:00 PM',
        title: 'Sunset Gathering',
        description: 'Watch the sunset together',
        location: 'Beachfront'
      },
      {
        id: 5,
        time: '7:00 PM',
        title: 'Farewell',
        description: 'End of celebrations',
        location: 'Beach Entrance'
      }
    ]
  ];

  const selectedEvent = eventHeaders[eventId];
  const programEvents = allProgramData[eventId];

  return (
    <div className="min-h-screen overflow-y-auto pb-28 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto p-6 relative">
        <div className="text-center mb-12">
          <div className="mb-6">
            <HeartLogo width={100} height={100} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#7C9270] mb-2">{selectedEvent.title}</h1>
          <p className="text-gray-600">{selectedEvent.date}</p>
          <div className="mt-1">
            <p className="text-gray-600">{selectedEvent.venue}</p>
            <a 
              href={selectedEvent.mapUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#7C9270] hover:text-[#5A6851] hover:underline"
            >
              {selectedEvent.location} (Open in Maps)
            </a>
          </div>
          <a 
            href="https://www.instagram.com/explore/tags/uo2025/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-800 transition-colors justify-center mt-3"
          >
            <span className="flex text-pink-600 gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
              #UO2025
            </span>
          </a>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
          {programEvents.map((event, index) => (
            <div 
              key={event.id} 
              className={`flex flex-col md:flex-row p-6 ${
                index !== programEvents.length - 1 ? 'border-b border-pink-100' : ''
              }`}
            >
              <div className="md:w-32 flex-shrink-0 mb-4 md:mb-0">
                <div className="text-pink-600 font-bold">{event.time}</div>
                <div className="text-gray-500 text-sm mt-1">{event.location}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                <p className="text-gray-600 mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>We can&apos;t wait to celebrate with you!</p>
          <p className="mt-2">Please arrive 30 minutes before the event begins.</p>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 pb-6 md:pb-4 safe-bottom">
        <div className="grid grid-cols-3 w-full max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center justify-center text-gray-800 hover:text-[#7C9270]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link href="/program?event=0" className="flex flex-col items-center justify-center text-[#7C9270]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1">Program</span>
          </Link>
          
          <Link href="/wall-of-love" className="flex flex-col items-center justify-center text-gray-800 hover:text-[#7C9270]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs mt-1">Wall of Love</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function ProgramPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    }>
      <ProgramContent />
    </Suspense>
  );
} 