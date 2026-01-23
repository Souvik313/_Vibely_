import React from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import './About.css';

const About = () => {
  return (
    <>
    <Navbar />
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Vibely</h1>
          <p className="tagline">Connect, Share, and Inspire</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="content-wrapper">
          <h2>Our Mission</h2>
          <p>
            Vibely is a modern social media platform designed to bring people together.
            We believe in creating a space where individuals can freely express themselves,
            share their stories, and build meaningful connections with others around the world.
          </p>
        </div>
      </section>

      <section className="about-features">
        <div className="content-wrapper">
          <h2>Why Choose Vibely?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Responsive</h3>
              <p>Lightning-fast performance optimized for all devices, from desktop to mobile.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with industry-standard security measures and encryption.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful Design</h3>
              <p>Intuitive and aesthetically pleasing interface that's easy to navigate.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile First</h3>
              <p>Fully responsive design that works seamlessly on all screen sizes.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Social Interactions</h3>
              <p>Connect with others through posts, comments, likes, and follower networks.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Save & Organize</h3>
              <p>Save your favorite posts and build your personal collection of content.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="content-wrapper">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Authenticity</h3>
              <p>We encourage genuine connections and real conversations between users.</p>
            </div>

            <div className="value-item">
              <h3>Inclusivity</h3>
              <p>Everyone is welcome. We celebrate diversity and treat all users with respect.</p>
            </div>

            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously improve and add new features based on user feedback.</p>
            </div>

            <div className="value-item">
              <h3>Transparency</h3>
              <p>We're open about how our platform works and how we use user data.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-technology">
        <div className="content-wrapper">
          <h2>Built with Modern Technology</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React 18 - Modern UI library</li>
                <li>Vite - Next-generation build tool</li>
                <li>React Router - Client-side routing</li>
                <li>Axios - HTTP client</li>
                <li>CSS3 - Advanced styling</li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js - JavaScript runtime</li>
                <li>Express.js - Web framework</li>
                <li>MongoDB - NoSQL database</li>
                <li>Mongoose - Database ODM</li>
                <li>JWT - Secure authentication</li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Services</h3>
              <ul>
                <li>Cloudinary - Image management</li>
                <li>MongoDB Atlas - Cloud database</li>
                <li>Bcrypt - Password hashing</li>
                <li>Multer - File uploads</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="content-wrapper">
          <h2>Our Team</h2>
          <p>
            Vibely is developed by a passionate team of developers and designers dedicated to
            creating the best social media experience. We're constantly working to improve the
            platform and make it more enjoyable for our users.
          </p>
          <div className="team-stats">
            <div className="stat">
              <h3>100%</h3>
              <p>Committed to Quality</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Support Available</p>
            </div>
            <div className="stat">
              <h3>∞</h3>
              <p>Passionate Developers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-join">
        <div className="content-wrapper">
          <h2>Join the Vibely Community</h2>
          <p>
            Start connecting with people around the world today. Share your stories, discover new content,
            and be part of a growing community that values authentic connections.
          </p>
          <div className="join-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="about-contact">
        <div className="content-wrapper">
          <h2>Get in Touch</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <a href="mailto:support@vibely.com">support@vibely.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🐦</span>
              <a href="https://x.com/SouvikRoy580736" target="_blank" rel="noopener noreferrer">
                Follow us on Twitter
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💼</span>
              <a href="https://linkedin.com/company/vibely" target="_blank" rel="noopener noreferrer">
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about-faq">
        <div className="content-wrapper">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-items">
            <div className="faq-item">
              <h4>Is Vibely free to use?</h4>
              <p>
                Yes! Vibely is completely free. We're committed to keeping our platform accessible to everyone.
              </p>
            </div>

            <div className="faq-item">
              <h4>How do I create an account?</h4>
              <p>
                Simply click "Register" and fill in your details. You'll be able to create an account in just a few steps.
              </p>
            </div>

            <div className="faq-item">
              <h4>Is my personal information safe?</h4>
              <p>
                We take security very seriously. All data is encrypted and protected using industry-standard security measures.
              </p>
            </div>

            <div className="faq-item">
              <h4>Can I delete my account?</h4>
              <p>
                Yes, you can request account deletion at any time. Your data will be permanently removed from our servers.
              </p>
            </div>

            <div className="faq-item">
              <h4>How do I report inappropriate content?</h4>
              <p>
                You can report content by clicking the report button on any post or user profile. Our team will review it promptly.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you have a mobile app?</h4>
              <p>
                Vibely is a responsive web application that works great on mobile devices. We may launch native apps in the future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default About;
