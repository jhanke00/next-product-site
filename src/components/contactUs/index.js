'use client';

//propTypes to be added for Javacript
import React, { useEffect, useState } from 'react';

import Card from '../../reusable/card';
import Alert from '../../reusable/alert';
import InputText from '../../reusable/input';
import FormError from '../../reusable/formError';
import { getStorage, setStorage } from '../../utils';
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
  const allSavedFormDetails = getStorage('formData', false) || [];

  const handleInputChange = (e) => {
    // function for saving the form data
    const { name, value } = e.target;
    if (name === 'zipCode') {
      const onlyNumberRegex = /^[0-9]*$/;
      const validCode = onlyNumberRegex.test(value);
      validCode &&
        setSaveFormData((prevData) => {
          return {
            ...prevData,
            zipCode: value,
          };
        });
    } else if (name === 'city' || name === 'state') {
      const onlyCharactersRegex = /^[a-zA-Z]+$/;
      const validCity = onlyCharactersRegex.test(value);
      (validCity === true || value === '') &&
        setSaveFormData((prevData) => {
          return {
            ...prevData,
            [name]: value,
          };
        });
    } else {
      setSaveFormData((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
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

    let result = Object.keys(saveFormData).filter(
      (o) => !saveFormData[o] && o !== 'addressLine2' && o !== 'middleName'
    );
    emailValidation === false && result.push('emailNotValid');
    result.length === 0 && setErrorInputs([]);
    result.length > 0
      ? (setErrorInputs(result), setFormSuccess(false))
      : (setStorage('formData', [...allSavedFormDetails, saveFormData], false), setFormSuccess(true));
  };

  useEffect(() => {
    if (saveFormData.email != '') {
      const neutralizeError = errorInputs.filter((error) => error != 'emailNotValid' && error != 'email');
      setErrorInputs(neutralizeError);
    }
  }, [saveFormData.email]);

  useEffect(() => {
    if (saveFormData.zipCode != '') {
      const neutralizeError = errorInputs.filter((error) => error != 'zipCode');
      setErrorInputs(neutralizeError);
    }
  }, [saveFormData.zipCode]);

  const handleSubmitAnotherForm = () => {
    setFormSuccess(false);
    setSaveFormData({
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
    setErrorInputs([]);
    setEmailErrorMessage('');
  };

  return (
    <>
      {(formSuccess || errorInputs.length > 0) && (
        <Alert
          type={
            formSuccess && errorInputs.length === 0 ? 'success' : errorInputs.length > 0 && !formSuccess ? 'danger' : ''
          }
          title={
            formSuccess && errorInputs.length === 0 ? 'Success' : errorInputs.length > 0 && !formSuccess ? 'Failed' : ''
          }
          description={
            formSuccess && errorInputs.length === 0
              ? 'Form Successfully Submitted'
              : errorInputs.length > 0 && !formSuccess
                ? 'Form Submission Failed'
                : ''
          }
        />
      )}
      <Card className='contactus-form text-center'>
        <h2 className='contactus-form-heading mb-3'>{LABELS.CONTACT_US_HEADING}</h2>
        {!formSuccess ? (
          <>
            <div className='d-flex justify-content-start flex-column flex-md-row my-2'>
              <span className='d-flex flex-column col-12 col-md-3 col-lg-4 text-start mx-1'>
                <InputText
                  label='First Name:'
                  type='text'
                  labelClassName='label-l'
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
              <span className='d-flex flex-column col-12 col-md-3 col-lg-4 text-start mx-1'>
                <InputText
                  label='Middle Name:'
                  type='text'
                  labelClassName='label-l'
                  name='middleName'
                  onChange={(e) => handleInputChange(e)}
                  value={saveFormData.middleName}
                />
              </span>
              <span className='d-flex flex-column col-12 col-md-3 col-lg-4 text-start mx-1'>
                <InputText
                  label='Last Name:'
                  type='text'
                  name='lastName'
                  labelClassName='label-l'
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
                  errorInputs.length > 0 && errorInputs?.includes('addressLine1')
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
            <div className='d-flex justify-content-start flex-column flex-md-row my-2'>
              <span className='d-flex flex-column text-start col-12 col-md-3 col-lg-4 mx-1'>
                <InputText
                  label='State:'
                  labelClassName='label-l'
                  type='text'
                  name='state'
                  onChange={(e) => handleInputChange(e)}
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
              <span className='d-flex flex-column col-12 col-md-3 col-lg-4 text-start mx-1'>
                <InputText
                  label='City:'
                  type='text'
                  name='city'
                  labelClassName='label-l'
                  onChange={(e) => handleInputChange(e)}
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
              <span className='d-flex flex-column col-12 col-md-3 col-lg-4 text-start mx-1'>
                <InputText
                  label='Zip Code:'
                  type='text'
                  name='zipCode'
                  maxlength='5'
                  labelClassName='label-l'
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
            <div className='my-2 d-flex flex-column text-start'>
              <InputText
                label='E-mail:'
                type='text'
                name='email'
                labelClassName='label-l'
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
            <div className='my-2 d-flex flex-column text-start'>
              <InputText
                label='Subject:'
                type='text'
                name='subject'
                labelClassName='label-l'
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
            <div className='my-2 d-flex flex-column text-start'>
              <label htmlFor='message' className='my-1 label-l'>
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
                {LABELS.SUBMIT}
              </button>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <h2 className='label-l mb-2'>{LABELS.SUCCESSFUL_FORM_HEADING}</h2>
            <button className='btn btn-primary contactus-form-button label-l' onClick={handleSubmitAnotherForm}>
              {LABELS.SUBMIT_ANOTHER_FORM}
            </button>
          </div>
        )}
      </Card>
    </>
  );
}
