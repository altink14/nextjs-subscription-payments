// pages/about-me.tsx or wherever you prefer to place your About Me page
import React from 'react';

const AboutMePage: React.FC = () => {
  return (
    <div className="mt-16 flex flex-row items-center justify-center" id='about'>
      {/* Left side with bullet points */}
      <div className="flex-1 p-8 flex flex-col justify-center items-center">
  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center shadow-lg p-4 bg-black/60 rounded-lg">
    What I Do
  </h2>
  <ul className="list-disc space-y-2 text-lg text-white bg-black/50 p-6 rounded-lg shadow">
    <li>Develop innovative AI solutions to complex problems.</li>
    <li>Design user-friendly interfaces for enhanced digital experiences.</li>
    <li>Collaborate with teams to bring creative projects to life.</li>
  </ul>
</div>

      {/* Right side with video */}
      <div className="flex-1 p-8">
        <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* This maintains a 16:9 aspect ratio */}
          <video 
            className="absolute top-0 left-0 w-full h-full" 
            src="basketball.mp4" // Specify the path to your video file
            autoPlay // Add this attribute to make the video play automatically
            loop // This makes the video play continuously
            muted // This ensures the video is muted
          ></video>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;