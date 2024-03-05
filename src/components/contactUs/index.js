'use client';

import React from 'react';

import { useState } from 'react';
import Card from '../../reusable/card';
import Alert from '../../reusable/alert';
import { setStorage } from '../../utils';
import { LABELS } from '../../constants';

import './contactus.css';

export default function ContactUsForm() {
  const [saveFormData, setSaveFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    subject: '',
  });
  const [errorInputs, setErrorInputs] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaveFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmitForm = () => {
    let result = Object.keys(saveFormData).filter((o) => !saveFormData[o]);
    console.log('saveFormData', saveFormData);
    console.log('result', result);
    result.length > 0 ? setErrorInputs(result) : setStorage('formData', saveFormData, false), setFormSuccess(true);
  };

  return (
    <>
      {(formSuccess || errorInputs.length > 0) && (
        <Alert
          type={(formSuccess && errorInputs.length === 0) ? 'success' : 'danger'}
          title={formSuccess && errorInputs.length === 0 ? 'Success' : 'Failed'}
          description={formSuccess && errorInputs.length === 0 ? 'Form Successfully Submitted' : 'Form Submission Failed'}
        />
      )}
      <Card className='contactus-form text-center'>
        <h2 className='contactus-form-heading mb-3'>{LABELS.CONTACT_US_HEADING}</h2>
        <div className='d-flex justify-content-start my-2'>
          <span className='d-flex flex-column text-start me-3 label-l'>
            <label htmlFor='firstName' className='my-1'>
              First Name:
            </label>
            <input type='text' name='firstName' onChange={(e) => handleInputChange(e)} value={saveFormData.firstName} />
          </span>
          <span className='d-flex flex-column text-start label-l'>
            <label htmlFor='lastName' className='my-1'>
              Last Name:
            </label>
            <input type='text' name='lastName' onChange={(e) => handleInputChange(e)} value={saveFormData.lastName} />
          </span>
        </div>
        <div className='my-2 d-flex flex-column text-start label-l'>
          <label htmlFor='email' className='my-1'>
            E-mail:{' '}
          </label>
          <input
            type='text'
            name='email'
            className='w-50'
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.email}
          />
        </div>
        <div className='my-2 d-flex flex-column text-start label-l'>
          <label htmlFor='subject' className='my-1'>
            Subject:{' '}
          </label>
          <input
            type='text'
            name='subject'
            className='w-25'
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.subject}
          />
        </div>
        <div className='my-2 d-flex flex-column text-start label-l'>
          <label htmlFor='message' className='my-1'>
            Please Enter Your message:
          </label>
          <textarea
            type='text'
            maxLength={250}
            name='message'
            className='p-2 message-box w-50'
            rows={5}
            cols={10}
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.message}
          />
        </div>
        <div className='text-start'>
          <button className='btn btn-primary' onClick={handleSubmitForm}>
            Submit
          </button>
        </div>
      </Card>
    </>
  );
}
