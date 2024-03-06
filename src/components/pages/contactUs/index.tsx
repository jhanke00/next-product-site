'use client';

import { useState } from 'react';

import { getStorage, setStorage } from '../../../utils';

import './contactUs.scss';

export default function ContactUs() {
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const formHandler = (e: any) => {
    let { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const formSubmit = (e: any) => {
    e.preventDefault();
    let contactRequests = getStorage('contactRequests') || [];
    contactRequests.push(formInputs);
    setStorage('contactRequests', contactRequests);
  };

  return (
    <div className='container pt-4 contact-form'>
      <h3>We are Here to Help You!</h3>
      <form className='mt-2 p-4 pt-2 text-start  contact-form-container'>
        <h5 className='mb-3'>Submit a Request</h5>
        <input
          type='text'
          name='fullName'
          className='form-control required'
          placeholder='Full Name'
          onChange={(e) => formHandler(e)}
        />
        <input type='text' name='email' className='form-control' placeholder='Email' onChange={(e) => formHandler(e)} />
        <input
          type='text'
          name='subject'
          className='form-control'
          placeholder='Subject'
          onChange={(e) => formHandler(e)}
        />
        <label>Message</label>
        <textarea className='form-control' name='message' onChange={(e) => formHandler(e)} />
        <button className='btn btn-primary mt-4' onClick={(e) => formSubmit(e)}>
          Submit
        </button>
      </form>
    </div>
  );
}
