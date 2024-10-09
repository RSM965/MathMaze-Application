// src/components/common/Footer.js
import React from "react";

const Footer = () => (
  <footer style={{ backgroundColor: '#34495e', padding: '30px', color: 'white', marginTop: '40px' }}>
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center" style={{ maxWidth: '800px' }}>
      {/* Left - Contact Us Section */}
      <div className="text-left mb-6 md:mb-0" style={{ maxWidth: '400px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px', color: '#f39c12' }}>Contact Us</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#ecf0f1' }}>
          <strong>Name:</strong> John Doe<br />
          <strong>Email:</strong> <a href="mailto:contact@mathmaze.com" style={{ color: '#3498db', textDecoration: 'none' }}>contact@mathmaze.com</a><br />
          <strong>Phone:</strong> <a href="tel:+15551234567" style={{ color: '#3498db', textDecoration: 'none' }}>+1 (555) 123-4567</a><br />
          <strong>Address:</strong> 123 Math Street, Numbersville, CA 12345
        </p>
      </div>

      {/* Right - Copyright Section */}
      <div className="text-center md:text-right" style={{ maxWidth: '400px' }}>
        <p style={{ fontSize: '15px', color: '#bdc3c7', marginBottom: '10px' }}>&copy; {new Date().getFullYear()} <span style={{ fontWeight: '700', color: '#f39c12' }}>MathMaze</span>. All rights reserved.</p>
        <p style={{ fontSize: '14px', color: '#95a5a6' }}>Follow us on:
          <a href="#" style={{ color: '#3498db', marginLeft: '10px', textDecoration: 'none' }}>Facebook</a> |
          <a href="#" style={{ color: '#3498db', marginLeft: '10px', textDecoration: 'none' }}>Twitter</a> |
          <a href="#" style={{ color: '#3498db', marginLeft: '10px', textDecoration: 'none' }}>Instagram</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
