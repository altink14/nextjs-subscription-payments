"use client"
import React, { useState } from 'react';

// Define a type for the FAQ item
type FaqItem = {
  question: string;
  answer: string;
};

// Sample FAQ data
const faqData: FaqItem[] = [
  {
    question: "What is Pixception?",
    answer: "Pixception is a platform dedicated to bringing you the best AI tools to enhance your productivity and creativity.",
  },
  {
    question: "How do I use the AI tools?",
    answer: "You can access the AI tools by navigating to the Tools section and selecting the tool you wish to use.",
  },
  {
    question: "Is Pixception free to use?",
    answer: "Yes, Pixception offers a range of free tools, with premium tools available for subscribers.",
  },
  // Add more FAQs here
];

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-16 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="w-full max-w-2xl space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="flex-1 bg-gray-700 p-4 rounded-lg shadow">
            <button
              className="w-full text-left font-semibold text-white hover:text-gray-200"
              onClick={() => toggleFaq(index)}
            >
              {faq.question}
            </button>
            <div
              className={`p-2 text-white transition-all duration-300 ease-in-out ${activeIndex === index ? 'block' : 'hidden'}`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;