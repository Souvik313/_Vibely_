import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null,
    loading: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, loading: true, error: null });

    try {
      // Simulate form submission
      // In production, replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Form submitted:', formData);
      
      setFormStatus({
        submitted: true,
        error: null,
        loading: false
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          error: null,
          loading: false
        });
      }, 5000);
    } catch (error) {
      setFormStatus({
        submitted: false,
        error: error.message,
        loading: false
      });
    }
  };

  return (
    <>
    <Navbar />
    <div className="contact-container">
      {/* Header Section */}
      <section className="contact-header">
        <div className="header-content">
          <h1>Get in Touch</h1>
          <p>Have a question or feedback? We'd love to hear from you!</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="content-wrapper">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Us</h3>
              <p>support@vibely.com</p>
              <p className="info-subtext">We'll respond within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
              <p className="info-subtext">Monday - Friday, 9AM - 6PM EST</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Us</h3>
              <p>123 Tech Street</p>
              <p className="info-subtext">San Francisco, CA 94102</p>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Support Hours</h3>
              <p>24/7 Online Support</p>
              <p className="info-subtext">Chat with us anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="content-wrapper">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible</p>
            </div>

            {formStatus.submitted && (
              <div className="success-message">
                ✓ Thank you for your message! We'll be in touch soon.
              </div>
            )}

            {formStatus.error && (
              <div className="error-message">
                ✗ {formStatus.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your inquiry..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-checkbox">
                <input type="checkbox" id="privacy" required />
                <label htmlFor="privacy">
                  I agree to the privacy policy and terms of service
                </label>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section">
        <div className="content-wrapper">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <h3>What's the best way to reach support?</h3>
              <p>
                You can reach us through email, phone, or our online chat. For urgent issues,
                we recommend using our live chat feature available 24/7.
              </p>
            </div>

            <div className="faq-card">
              <h3>How long does it take to get a response?</h3>
              <p>
                Email inquiries are typically answered within 24 hours. Chat support is available
                immediately during business hours. Critical issues receive priority handling.
              </p>
            </div>

            <div className="faq-card">
              <h3>Do you offer technical support?</h3>
              <p>
                Yes! Our technical support team is available to help with account issues,
                feature questions, and troubleshooting. Select "Technical Support" when contacting us.
              </p>
            </div>

            <div className="faq-card">
              <h3>How do I report a bug?</h3>
              <p>
                Please use our contact form and select "Bug Report" as the category. Provide
                details about the issue and steps to reproduce it for faster resolution.
              </p>
            </div>

            <div className="faq-card">
              <h3>Are there partnership opportunities?</h3>
              <p>
                We're always interested in partnerships and collaborations. Select "Partnership"
                in the contact form to discuss potential opportunities.
              </p>
            </div>

            <div className="faq-card">
              <h3>What's your privacy commitment?</h3>
              <p>
                We take your privacy seriously. All communications are confidential and handled
                according to our privacy policy. Your data is never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Contact;
