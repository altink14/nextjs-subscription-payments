// pages/about-me.tsx or wherever you prefer to place your About Me page
import React from 'react';

const AboutMePage: React.FC = () => {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" id='about'>
      {/* Grid */}
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* This maintains a 16:9 aspect ratio */}
          <video 
            className="absolute top-0 left-0 w-full h-full rounded-xl" 
            src="basketball.mp4" // Specify the path to your video file
            autoPlay // Add this attribute to make the video play automatically
            loop // This makes the video play continuously
            muted // This ensures the video is muted
          ></video>
        </div>
        {/* End Col */}

        <div className="mt-5 sm:mt-10 lg:mt-0">
          <div className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div className="space-y-2 md:space-y-4">
              <h2 className="font-bold text-3xl lg:text-4xl text-gray-250">
                What I Do
              </h2>
              <p className="text-gray-250">
                I am passionate about creating innovative solutions and providing exceptional digital experiences. Here are some of the things I specialize in:
              </p>
            </div>
            {/* End Title */}

            {/* List */}
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex space-x-3">
                <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                  <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>

                <span className="text-sm sm:text-base text-gray-250 ">
                  <span className="font-bold">Develop</span> innovative AI solutions to complex problems.
                </span>
              </li>

              <li className="flex space-x-3">
                <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                  <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>

                <span className="text-sm sm:text-base text-gray-250">
                  <span className="font-bold">Design</span> user-friendly interfaces for enhanced digital experiences.
                </span>
              </li>

              <li className="flex space-x-3">
                <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                  <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>

                <span className="text-sm sm:text-base text-gray-250">
                  <span className="font-bold">Collaborate</span> with teams to bring creative projects to life.
                </span>
              </li>
            </ul>
            {/* End List */}
          </div>
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
};

export default AboutMePage;