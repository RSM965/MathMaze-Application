// src/components/common/Footer.js
import React from "react";

const Footer = () => (
  <footer className="bg-gray-800 p-8 text-white mt-10">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      {/* Left - Contact Us Section */}
      <div className="text-left mb-6 md:mb-0">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg">
          <strong>Name:</strong> John Doe<br />
          <strong>Email:</strong> contact@mathmaze.com<br />
          <strong>Phone:</strong> +1 (555) 123-4567<br />
          <strong>Address:</strong> 123 Math Street, Numbersville, CA 12345
        </p>
      </div>

      {/* Right - Copyright Section */}
      <div className="text-center md:text-right">
        <p>&copy; {new Date().getFullYear()} MathMaze. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
