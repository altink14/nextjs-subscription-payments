"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const HomePage = () => {
  // Arrays of URLs for each section, now including a third image URL
  const createImageUrls = ['background.png', 'https://img.mytsi.org/i/vwKy578.jpg', 'https://img.mytsi.org/i/ivoS585.png','https://img.mytsi.org/i/KOks589.png'];
  const yourImageUrls = ['background1.png', 'https://img.mytsi.org/i/4Vk2581.jfif', 'https://img.mytsi.org/i/XnyI587.jfif','https://img.mytsi.org/i/gunN588.png'];
  const worldImageUrls = ['background2.png', 'https://img.mytsi.org/i/Z4vm580.png', 'https://img.mytsi.org/i/h0F9586.png','https://img.mytsi.org/i/eIfs582.png'];

  // State to manage the current and next index of the background image for each section
  const [createIndex, setCreateIndex] = useState(0);
  const [yourIndex, setYourIndex] = useState(0);
  const [worldIndex, setWorldIndex] = useState(0);

  // State to manage the opacity for fade effect for each section
  const [createOpacity, setCreateOpacity] = useState(1);
  const [yourOpacity, setYourOpacity] = useState(1);
  const [worldOpacity, setWorldOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Smooth transition for "Create" section
      setCreateOpacity(0);
      setTimeout(() => {
        setCreateIndex(current => (current + 1) % createImageUrls.length);
        setCreateOpacity(1);
      }, 1000); // Halfway through the interval

      // Smooth transition for "Your" section
      setYourOpacity(0);
      setTimeout(() => {
        setYourIndex(current => (current + 1) % yourImageUrls.length);
        setYourOpacity(1);
      }, 1200); // Halfway through the interval

      // Smooth transition for "World" section
      setWorldOpacity(0);
      setTimeout(() => {
        setWorldIndex(current => (current + 1) % worldImageUrls.length);
        setWorldOpacity(1);
      }, 1400); // Halfway through the interval
    }, 5000); // Change image every 5 seconds, allowing 1.5 seconds for fade out and 1.5 for fade in

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      {/* Section 1 - "Create" */}
      <div 
        className="w-1/3 h-screen bg-cover bg-center flex justify-center items-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${createImageUrls[createIndex]})`, opacity: createOpacity }}
      >
        <div className="bg-black/60 p-4 md:p-8 rounded-lg text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white shadow-lg shadow-black">Create</h1>
        </div>
      </div>
      
      {/* Section 2 - "YOUR" */}
      <div 
        className="w-1/3 h-screen bg-cover bg-center flex flex-col justify-center items-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${yourImageUrls[yourIndex]})`, opacity: yourOpacity }}
      >
        <div className="bg-black/60 p-4 md:p-8 rounded-lg text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white shadow-lg shadow-black">Your</h1>
        </div>
      </div>
      
      {/* Section 3 - "World" */}
      <div 
        className="w-1/3 h-screen bg-cover bg-center flex justify-center items-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${worldImageUrls[worldIndex]})`, opacity: worldOpacity }}
      >
        <div className="bg-black/60 p-4 md:p-8 rounded-lg text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white shadow-lg shadow-black">World</h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;