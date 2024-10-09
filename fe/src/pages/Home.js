import React, { useState, useEffect } from 'react';
import './Home.css'; // Custom styles

const testimonials = [
  {
    name: "Simi Mathew",
    text: "MathMaze has helped me to learn basics of trigonometry. The interactive Chatbot and aesthetic design are the reasons why I would recommend it.",
    img: "/static/Simi.png"
  },
  {
    name: "Vrinda Satheesh",
    text: "Differentiation and Integration were always pain points for me, but after MathMaze I find these subjects a breeze.",
    img: "/static/Vri.png"
  },
  {
    name: "Ronald Sabu",
    text: "Algebra was always a struggle. With the help of MathMaze, I got amazing grades in school.",
    img: "/static/Ron.png"
  }
];

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [fade, setFade] = useState(true);

  // Automatically change testimonial every 3 seconds with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);  // Trigger fade-out
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setFade(true);  // Trigger fade-in after testimonial change
      }, 500); // Sync with CSS animation duration
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Function to go to the previous testimonial
  const prevTestimonial = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setFade(true);
    }, 500);
  };

  // Function to go to the next testimonial
  const nextTestimonial = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setFade(true);
    }, 500);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex">
        {/* Left Half - Tagline */}
        <div className="w-1/2 flex items-center justify-center pr-8">
          <div className="text-left">
            <h1 className="text-6xl font-bold leading-tight">
              Making Math <br /> easy for <br /> young minds
            </h1>
          </div>
        </div>
        
        {/* Right Half - Testimonials */}
        <div className="w-1/2 flex justify-center items-center">
          <div className="border border-gray-300 p-6 rounded-lg shadow-lg testimonial-box">
            <div className={`testimonial text-center ${fade ? 'fade-in' : 'fade-out'}`}>
              <img
                src={testimonials[currentTestimonial].img}
                alt={testimonials[currentTestimonial].name}
                className="w-36 h-36 rounded-full mx-auto mb-6"  
              />
              <p className="text-xl italic mb-4">"{testimonials[currentTestimonial].text}"</p> {/* Increased size by 150% */}
              <p className="text-lg font-bold">- {testimonials[currentTestimonial].name}</p> {/* Increased size by 150% */}
            </div>

            {/* Slider Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prevTestimonial}
                className="bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-lg font-bold"
              >
                ‹
              </button>
              <button
                onClick={nextTestimonial}
                className="bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-lg font-bold"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
