import React from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { HiOutlinePuzzlePiece } from 'react-icons/hi2';
import { PiPlantLight } from 'react-icons/pi';

const Features: React.FC = () => {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="grid gap-12">
          <div>
            <h2 className="text-3xl text-gray-250 font-bold">
              Our Mission
            </h2>
            <p className="mt-3 text-gray-100">
              In today's world, where technology and human interaction are increasingly intertwined, our mission is to create spaces that seamlessly blend innovation with community. We aim to offer environments where cutting-edge technology and personal connections thrive together.
            </p>
          </div>

          <div className="space-y-6 lg:space-y-10">
            <div className="flex">
              <HiOutlineLightBulb className="flex-shrink-0 mt-2 size-10 text-gray-100 dark:text-white" />
              <div className="ms-5 sm:ms-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-250">
                  Innovative Digital Solutions
                </h3>
                <p className="mt-1 text-gray-100">
                  Our advanced digital platforms are crafted to simplify and enrich daily life. By leveraging the power of AI tools, we provide solutions that not only tackle complex challenges but also enhance efficiency and enjoyment in everyday tasks.
                </p>
              </div>
            </div>

            <div className="flex">
              <HiOutlinePuzzlePiece className="flex-shrink-0 mt-2 size-10 text-gray-100 dark:text-white" />
              <div className="ms-5 sm:ms-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-250">
                  Seamless Integration
                </h3>
                <p className="mt-1 text-gray-100">
                  We take care of the technical details so our users can focus on what truly matters. From easy-to-navigate application processes to seamless, all-inclusive digital services, we make integrating technology into daily life as effortless as possible.
                </p>
              </div>
            </div>

            <div className="flex">
              <PiPlantLight className="flex-shrink-0 mt-2 size-12 text-gray-100 dark:text-white" />
              <div className="ms-5 sm:ms-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-250">
                  Empowering Individual Growth
                </h3>
                <p className="mt-1 text-gray-100">
                  We believe in the potential of every individual. Through our digital tools and resources, we aim to empower people to achieve their personal and professional goals, fostering growth and development in a supportive environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;