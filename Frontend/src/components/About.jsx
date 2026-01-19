import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* About Header */}
      <div className="about-header">
        <h1>About MyPlantExpert</h1>
        <p>Learn more about our mission to help plant enthusiasts everywhere</p>
      </div>

      {/* Core Values */}
      <section className="about-section core-values">
        <h2>Our Core Values</h2>
        <div className="values-container">
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>Sustainability</h3>
            <p>
              We're committed to promoting sustainable plant care practices that
              benefit both people and the planet.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <h3>Education</h3>
            <p>
              We believe in making expert plant knowledge accessible to
              everyone, regardless of experience level.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Community</h3>
            <p>
              We foster a supportive community where plant enthusiasts can
              connect, share, and grow together.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3>Innovation</h3>
            <p>
              We continuously develop new tools and resources to enhance the
              plant care experience.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="about-section contact-cta">
        <h2>Want To Get In Touch?</h2>
        <p>
          We'd love to hear from you! Whether you have questions, feedback, or
          ideas to share.
        </p>
        <Link to="/contact" className="btn primary-btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
};

export default About;
