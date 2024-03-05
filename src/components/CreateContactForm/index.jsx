import { useState } from 'react';

const CreateContactFrom = () => {
  const initialFormValue = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  const formFiledErrorMessages = {
    name: 'Please enter your Name.',
    email: 'Please give us your e-mail address so that we can contact you.',
    correct_email: 'Please enter correct email E-Mail address.',
    subject: 'Please enter your Subject.',
    message: 'Please enter your Message.',
  };
  const [formData, setFormData] = useState(initialFormValue);
  const [errorMessage, setErrorMessage] = useState({});
  const [sucessMsg, setSucessMsg] = useState('');
  let errors = {};

  const handlesubmit = (e) => {
    e.preventDefault();
    let formIsValid = validateContactForm();

    if (formIsValid) {
      setSucessMsg(`Thanks ${formData.name} for contacting us !!! 
      Our team will contact you shortly`);
      let message = JSON.parse(localStorage.getItem('messages')) || [];
      message.push(formData);
      localStorage.setItem('messages', JSON.stringify(message));
      setFormData(initialFormValue);
    }
  };

  const validateContactForm = () => {
    let fields = formData;
    let formIsValid = true;
    let errors = {};

    if (!fields['name']) {
      formIsValid = false;
      errors['name'] = formFiledErrorMessages['name'];
    }

    if (!fields['email']) {
      formIsValid = false;
      errors['email'] = formFiledErrorMessages['email'];
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const isValidEmail = emailRegex.test(fields['email']);
      if (!isValidEmail) {
        formIsValid = false;
        errors['email'] = !isValidEmail && formFiledErrorMessages['correct_email'];
      }
    }

    if (!fields['subject']) {
      formIsValid = false;
      errors['subject'] = formFiledErrorMessages['subject'];
    }

    if (!fields['message']) {
      formIsValid = false;
      errors['message'] = formFiledErrorMessages['message'];
    }
    setErrorMessage(errors);
    return formIsValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFocus = () => {
    sucessMsg !== '' && setSucessMsg('');
  };

  const isFormFieldValueEmpty = (name) => {
    if (!formData[name]) {
      let newErrorMessage = {
        ...errorMessage,
        [name]: formFiledErrorMessages[name],
      };
      setErrorMessage(newErrorMessage);
    }
  };

  const handleBlur = (fieldName) => {
    isFormFieldValueEmpty(fieldName);
    console.log('value+++' + fieldName);
  };

  return (
    <div className='contact-form'>
      <div className='sucess-message'>{sucessMsg}</div>
      <h3>Contact Us</h3>
      <form onSubmit={handlesubmit} onFocus={handleFocus}>
        <div className='form-field'>
          <label>Your Name</label>
          <input
            name='name'
            id='name'
            onBlur={() => handleBlur('name')}
            placeholder={formFiledErrorMessages.name}
            value={formData.name}
            onChange={(e) => handleChange(e)}
          ></input>
          <div className='error-message'>{errorMessage.name}</div>
        </div>
        <div className='form-field'>
          <label>Email</label>
          <input
            name='email'
            id='email'
            onBlur={() => handleBlur('email')}
            placeholder={formFiledErrorMessages.email}
            value={formData.email}
            onChange={(e) => handleChange(e)}
          ></input>
          <div className='error-message'>{errorMessage.email}</div>
        </div>
        <div className='form-field'>
          <label>Subject</label>
          <input
            name='subject'
            id='subject'
            onBlur={() => handleBlur('subject')}
            placeholder={formFiledErrorMessages.subject}
            value={formData.subject}
            onChange={(e) => handleChange(e)}
          ></input>
          <div className='error-message'>{errorMessage.subject}</div>
        </div>
        <div className='form-field'>
          <label>Message</label>
          <textarea
            name='message'
            id='message'
            onBlur={() => handleBlur('message')}
            placeholder={formFiledErrorMessages.message}
            value={formData.message}
            onChange={(e) => handleChange(e)}
          >
            {' '}
          </textarea>
          <div className='error-message'>{errorMessage.message}</div>
        </div>
        <div className='form-button'>
          <button> Send </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContactFrom;
