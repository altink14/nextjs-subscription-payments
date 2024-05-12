// components/Header.tsx
import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      {/* Section 1 */}
      <div 
        className="w-1/3 h-screen bg-cover bg-center flex justify-center items-center group"
        style={{ backgroundImage: `url('background.png')` }}
      >
        <div className="bg-black/50 p-4 md:p-8 rounded-lg text-center transition-all duration-300 ease-in-out group-hover:bg-black/60 group-hover:scale-105">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Section 1</h1>
          {/* Additional content for Section 1 */}
        </div>
      </div>
      
      {/* Section 2 */}
      <div 
        className="w-1/3 h-screen bg-cover bg-center flex flex-col justify-center items-center group"
        style={{ backgroundImage: `url('background1.png')` }}
      >
        <div className="bg-black/50 p-4 md:p-8 rounded-lg text-center transition-all duration-300 ease-in-out group-hover:bg-black/60 group-hover:scale-105">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Section 2</h1>
          <Link legacyBehavior href="/your-target-path">
            <a className="text-blue-300 hover:text-blue-500 mt-4">Press</a>
          </Link>
        </div>
      </div>
      
      {/* Section 3 */}
      <div 
        className="w-1/3 h-screen bg-cover bg-center flex justify-center items-center group"
        style={{ backgroundImage: `url('background2.png')` }}
      >
        <div className="bg-black/50 p-4 md:p-8 rounded-lg text-center transition-all duration-300 ease-in-out group-hover:bg-black/60 group-hover:scale-105">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Section 3</h1>
          {/* Additional content for Section 3 */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;