// src/components/About.js
import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold mb-6">About MathMaze</h1>
      <p className="text-lg">
        MathMaze is an innovative learning platform aimed at making math easier and more accessible for students of all ages. 
        Our goal is to provide students, parents, and teachers with interactive tools and resources that enhance their learning experience.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Our Mission</h2>
      <p className="text-lg mt-2">
        At MathMaze, we believe that every student deserves to excel in mathematics. Through our platform, we offer a combination of 
        interactive learning tools, performance tracking, and personalized feedback to ensure that every student can master the subject.
      </p>

      <h2 className="text-2xl font-semibold mt-6">What We Offer</h2>
      <ul className="list-disc pl-6 mt-2 text-lg">
        <li>Interactive lessons and quizzes</li>
        <li>Performance tracking for students</li>
        <li>Feedback tools for teachers and parents</li>
        <li>Personalized learning paths</li>
      </ul>
    </div>
  );
};

export default About;
