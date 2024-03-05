'use client';

import React, { useEffect } from 'react';

import { useState } from 'react';
import Card from '../../reusable/card';
import Alert from '../../reusable/alert';
import InputText from '../../reusable/input';
import FormError from '../../reusable/formError';
import { setStorage } from '../../utils';
import { LABELS } from '../../constants';

import './contactus.css';

export default function ContactUsForm() {
  const [saveFormData, setSaveFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    state: '',
    city: '',
    zipCode: '',
    addressLine1: '',
    addressLine2: '',
    message: '',
    subject: '',
  });
  const [errorInputs, setErrorInputs] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const handleInputChange = (e) => {
    // function for saving the form data
    const { name, value } = e.target;
    setSaveFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmitForm = () => {
    // function call on Submit click. Here all the validations will take place
    let emailValidation;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailValidation = emailRegex.test(saveFormData.email);
    const emailHasAt = saveFormData.email.includes('@');
    const emailErrorMessage = emailHasAt
      ? `Please add a part following @. '${saveFormData.email}' is incomplete.`
      : `Please include an '@' in the email address. '${saveFormData.email} is missing and '@'`;
    setEmailErrorMessage(emailErrorMessage);

    let result =
      Object.keys(saveFormData).filter((o) => !saveFormData[o]) && o !== 'addressLine2' && o !== 'middleName';
    emailValidation === false && result.push('emailNotValid');
    console.log('result', result);
    result.length > 0 ? setErrorInputs(result) : setStorage('formData', saveFormData, false);
    setFormSuccess(true);
  };

  useEffect(() => {
    if (saveFormData.email != '') {
      const neutralizeError = errorInputs.filter((error) => error != 'emailNotValid' && error != 'email');
      setErrorInputs(neutralizeError);
    }
  }, [saveFormData.email]);

  return (
    <>
      {(formSuccess || errorInputs.length > 0) && (
        <Alert
          type={formSuccess && errorInputs.length === 0 ? 'success' : 'danger'}
          title={formSuccess && errorInputs.length === 0 ? 'Success' : 'Failed'}
          description={
            formSuccess && errorInputs.length === 0 ? 'Form Successfully Submitted' : 'Form Submission Failed'
          }
        />
      )}
      <Card className='contactus-form text-center'>
        <h2 className='contactus-form-heading mb-3'>{LABELS.CONTACT_US_HEADING}</h2>
        <div className='d-flex justify-content-start my-2'>
          <span className='d-flex flex-column text-start me-3 label-l'>
            <InputText
              label='First Name:'
              type='text'
              name='firstName'
              onChange={(e) => handleInputChange(e)}
              value={saveFormData.firstName}
              required
              error={
                errorInputs.length > 0 && errorInputs?.includes('firstName')
                  ? {
                      type: 'error',
                      message: 'Please enter your First Name',
                    }
                  : {}
              }
            />
          </span>
          <span className='d-flex flex-column text-start me-3 label-l'>
            <InputText
              label='Middle Name:'
              type='text'
              name='middleName'
              onChange={(e) => handleInputChange(e)}
              value={saveFormData.middleName}
            />
          </span>
          <span className='d-flex flex-column text-start label-l'>
            <InputText
              label='Last Name:'
              type='text'
              name='lastName'
              onChange={(e) => handleInputChange(e)}
              value={saveFormData.lastName}
              required
              error={
                errorInputs.length > 0 && errorInputs?.includes('lastName')
                  ? {
                      type: 'error',
                      message: 'Please enter your Last Name',
                    }
                  : {}
              }
            />
          </span>
        </div>
        <div className='d-flex flex-column text-start'>
          <InputText
            label='Address Line 1:'
            labelClassName='label-l'
            type='text'
            name='addressLine1'
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.addressLine1}
            required
            error={
              errorInputs.length > 0 && errorInputs?.includes('addressline1')
                ? {
                    type: 'error',
                    message: 'Please enter a Valid Address',
                  }
                : {}
            }
          />
        </div>
        <div className='d-flex flex-column text-start'>
          <InputText
            label='Address Line 2:'
            labelClassName='label-l'
            type='text'
            name='addressLine2'
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.addressLine2}
          />
        </div>
        <div className='d-flex justify-content-start my-2'>
          <span className='d-flex flex-column text-start me-3 label-l'>
            <InputText
              label='State:'
              labelClassName='label-l'
              type='text'
              name='state'
              onChange={(e) => handleInputChange(e)}
              onKeyPress={(e) => !/^[a-zA-Z]+$/.test(e.key) && e.preventDefault()}
              value={saveFormData.state}
              required
              error={
                errorInputs.length > 0 && errorInputs?.includes('state')
                  ? {
                      type: 'error',
                      message: 'Please enter State',
                    }
                  : {}
              }
            />
          </span>
          <span className='d-flex flex-column text-start me-3 label-l'>
            <InputText
              label='City:'
              type='text'
              name='city'
              onChange={(e) => handleInputChange(e)}
              onKeyPress={(e) => !/^[a-zA-Z]+$/.test(e.key) && e.preventDefault()}
              value={saveFormData.city}
              required
              error={
                errorInputs.length > 0 && errorInputs?.includes('city')
                  ? {
                      type: 'error',
                      message: 'Please enter city',
                    }
                  : {}
              }
            />
          </span>
          <span className='d-flex flex-column text-start label-l'>
            <InputText
              label='Zip Code:'
              type='text'
              name='zipCode'
              onChange={(e) => handleInputChange(e)}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              value={saveFormData.zipCode}
              required
              error={
                errorInputs.length > 0 && errorInputs?.includes('zipCode')
                  ? {
                      type: 'error',
                      message: 'Please enter Zip Code',
                    }
                  : {}
              }
            />
          </span>
        </div>
        <div className='my-2 d-flex flex-column text-start label-l'>
          <InputText
            label='E-mail:'
            type='text'
            name='email'
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.email}
            required
            error={
              errorInputs.length > 0 && errorInputs?.includes('email')
                ? {
                    type: 'error',
                    message: 'Please enter a Valid Email',
                  }
                : errorInputs.includes('emailNotValid')
                  ? {
                      type: 'error',
                      message: emailErrorMessage,
                    }
                  : {}
            }
          />
        </div>
        <div className='my-2 d-flex flex-column text-start label-l'>
          <InputText
            label='Subject:'
            type='text'
            name='subject'
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.subject}
            required
            error={
              errorInputs.length > 0 && errorInputs?.includes('subject')
                ? {
                    type: 'error',
                    message: 'Please enter Subject',
                  }
                : {}
            }
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
            className={`p-2 message-box w-50 ${errorInputs.length > 0 && errorInputs?.includes('message') ? 'text-area-error' : ''}`}
            rows={5}
            cols={10}
            onChange={(e) => handleInputChange(e)}
            value={saveFormData.message}
            required
          />
          {errorInputs.length > 0 && errorInputs?.includes('message') && (
            <FormError
              error={{
                type: 'error',
                message: 'Please enter message',
              }}
              errorId={'textArea-error'}
            />
          )}
        </div>
        <div className='text-start my-3'>
          <button className='btn btn-primary contactus-form-button label-l' onClick={handleSubmitForm}>
            Submit
          </button>
        </div>
      </Card>
    </>
  );
}
