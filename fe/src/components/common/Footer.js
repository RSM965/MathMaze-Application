// src/components/common/Footer.js
import React from "react";

const Footer = () => (
  <footer className="bg-gray-800 p-4 text-white text-center mt-10">
    <p>&copy; {new Date().getFullYear()} MathMaze. All rights reserved.</p>
  </footer>
);

export default Footer;
