import React from 'react';
import '../HomeScss/footer.scss'; // Make sure the path is correct
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import logo from '../HomeAssets/logo3.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section 1: Logo and Tagline */}
        <div className="footer-section footer-logo-section">
          <img src={logo} alt="Company Logo" className="footer-logo" />
          <p className="footer-tagline">Making your life easier, one click at a time.</p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/AboutUs">About Us</Link></li>
            {/* <li><Link to="/services">Our Services</Link></li> */}
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Section 3: Social Media */}
        <div className="footer-section footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="https://twitter.com" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
            <a href="https://instagram.com" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>

        {/* Section 4: Newsletter Signup */}
        <div className="footer-section footer-newsletter">
          <h3>Subscribe to our Newsletter</h3>
          <form onSubmit={(e) => e.preventDefault()}> {/* Added onSubmit to prevent page reload */}
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 RideNow All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;