import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      errors.email = "Email must contain @";
    } else if (!formData.email.match(/\.[a-zA-Z]{2,}$/)) {
      errors.email =
        "Email must have a valid domain extension (e.g., .com, .net)";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.length > 100) {
      errors.subject = "Subject must be less than 100 characters";
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.length < 10) {
      errors.message = "Message should be at least 10 characters";
    } else if (formData.message.length > 1000) {
      errors.message = "Message must be less than 1000 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSending(true);

      // Initialize EmailJS with new public key
      emailjs.init("538M5PrcwOWQtXc1s");

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      // Send email using EmailJS
      emailjs
        .send("service_be8lplh", "template_bdktxuo", templateParams)
        .then(() => {
          setSubmitted(true);
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        })
        .catch((error) => {
          alert("Failed to send message. Please try again.");
          console.error("Error:", error);
        })
        .finally(() => {
          setSending(false);
        });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p>Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-container">
          {submitted ? (
            <div className="form-success-message">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Thank You!</h3>
              <p>
                Your message has been sent successfully. We'll get back to you
                shortly.
              </p>
              <button
                className="btn primary-btn"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className={formErrors.name ? "error" : ""}
                      />
                    </div>
                    {formErrors.name && (
                      <span className="error-message">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-icon">
                      <i className="fas fa-at"></i>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        className={formErrors.email ? "error" : ""}
                      />
                    </div>
                    {formErrors.email && (
                      <span className="error-message">{formErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <div className="input-with-icon">
                    <i className="fas fa-heading"></i>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="What is your message about?"
                      value={formData.subject}
                      onChange={handleChange}
                      className={formErrors.subject ? "error" : ""}
                    />
                  </div>
                  {formErrors.subject && (
                    <span className="error-message">{formErrors.subject}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <div className="textarea-with-icon">
                    <i className="fas fa-comment-alt"></i>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      className={formErrors.message ? "error" : ""}
                    ></textarea>
                  </div>
                  {formErrors.message && (
                    <span className="error-message">{formErrors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn primary-btn send-btn"
                  disabled={sending}
                >
                  {sending ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <span className="btn-content">
                      <span>Send Message</span>
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
