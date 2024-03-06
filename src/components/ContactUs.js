'use client';
import React, { useState, useEffect } from 'react';

const ContactUs = () => {
  const initialFormData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Retrieve form data from local storage on component mount
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    // Save form data to local storage
    localStorage.setItem('formData', JSON.stringify(formData));
    console.log('Message submitted:', formData);
    // Clear form data
    setFormData(initialFormData);
  };

  return (
    <div>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name : </label>
          <input type='text' name='name' value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email : </label>
          <input type='email' name='email' value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Subject : </label>
          <input type='text' name='subject' value={formData.subject} onChange={handleChange} required />
        </div>
        <div>
          <label>Message : </label>
          <textarea name='message' value={formData.message} onChange={handleChange} required />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};
export default ContactUs;
