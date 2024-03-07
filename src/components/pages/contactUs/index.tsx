'use client';

import { useState, useEffect } from 'react';

import { getStorage, setStorage, emailValidation } from '../../../utils';

import './contactUs.scss';

export default function ContactUs() {
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [inputErrors, setInputErrors] = useState({
    fullName: null,
    email: null,
    subject: null,
    message: null,
  });
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formHandler = (e: any) => {
    let { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });
    setInputErrors({ ...inputErrors, [name]: null });
    name === 'email' && setInvalidEmail(false);
  };

  const formSubmit = (e: any) => {
    e.preventDefault();
    const isEmpty = emptyCheck(formInputs);
    setSubmitSuccess(false);
    if (isEmpty) {
      formErrorInputs(formInputs);
    } else if (!emailValidation(formInputs?.email, '')) {
      setInvalidEmail(true);
    } else {
      let contactRequests = getStorage('contactRequests') || [];
      contactRequests.push(formInputs);
      setStorage('contactRequests', contactRequests);
      setInvalidEmail(false);
      setSubmitSuccess(true);
      setFormInputs({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };

  const emptyCheck = (formInputObj: object) => {
    return Object.values(formInputObj).some((val) => val === '');
  };

  const formErrorInputs = (formInputObj: object) => {
    let errorObj = {};
    for (const [key, value] of Object.entries(formInputObj)) {
      if (value === '') {
        errorObj = { ...errorObj, [key]: 'Please Enter your ' + key };
      } else {
        errorObj = { ...errorObj, [key]: '' };
      }
    }
    setInputErrors(errorObj);
  };

  useEffect(() => {
    if (submitSuccess) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }
  }, [submitSuccess]);

  return (
    <>
      {submitSuccess && (
        <div className='submit-success text-center'>
          Submitted Successfully, We will get back to you in 2 business days, Thank you
        </div>
      )}
      <div className='container pt-4 contact-form'>
        <h4>We are Here to Help You!</h4>
        <form className='mt-2 p-4 pt-2 text-start  contact-form-container'>
          <h2 className='mb-4 text-center'>Contact Us</h2>
          <div className='form-group'>
            <input
              type='text'
              name='fullName'
              className='form-control required'
              placeholder='Full Name'
              onChange={(e) => formHandler(e)}
            />
            {inputErrors?.fullName && <p className='error'>{inputErrors?.fullName}</p>}
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='email'
              className='form-control'
              placeholder='Email'
              onChange={(e) => formHandler(e)}
            />
            {(inputErrors?.email || invalidEmail) && (
              <p className='error'>{inputErrors?.email ? inputErrors?.email : 'Please Enter a Valid Email'}</p>
            )}
          </div>
          <div className='form-group'>
            <input
              type='text'
              name='subject'
              className='form-control'
              placeholder='Subject'
              onChange={(e) => formHandler(e)}
            />
            {inputErrors?.subject && <p className='error'>{inputErrors?.subject}</p>}
          </div>
          <div className='form-group'>
            <label>Message</label>
            <textarea className='form-control' name='message' onChange={(e) => formHandler(e)} />
            {inputErrors?.message && <p className='error'>{inputErrors?.message}</p>}
          </div>
          <button className='btn btn-primary mt-4' onClick={(e) => formSubmit(e)}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
