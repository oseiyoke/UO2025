import Link from 'next/link';

export default function ProgramPage() {
  // Sample program data (in a real app, this would come from a database or API)
  const programEvents = [
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
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Wedding Program</h1>
          <p className="text-gray-600">Saturday, April 12, 2025</p>
          <p className="text-gray-600 mt-1">Flairmore Event Center, Uyo</p>
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
          <p className="mt-2">Please arrive 30 minutes before the ceremony begins.</p>
        </div>
      </div>
    </div>
  );
} 