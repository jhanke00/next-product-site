import { ValidationErrors } from '@/src/type/checkout';

// Email validation
export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

// Phone validation (US format)
export const validatePhone = (phone: string): string => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phoneRegex.test(phone) || digitsOnly.length < 10) {
    return 'Invalid phone number (minimum 10 digits)';
  }
  return '';
};

// Zip code validation (US format)
export const validateZipCode = (zipCode: string): string => {
  if (!zipCode) return 'Zip code is required';
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) return 'Invalid zip code (use 12345 or 12345-6789)';
  return '';
};

// Credit card validation using Luhn algorithm
export const validateCreditCard = (cardNumber: string): string => {
  if (!cardNumber) return 'Card number is required';

  const digitsOnly = cardNumber.replace(/\s/g, '');

  if (!/^\d+$/.test(digitsOnly)) return 'Card number must contain only digits';
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return 'Card number must be between 13 and 19 digits';
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) return 'Invalid card number';
  return '';
};

// CVV validation
export const validateCVV = (cvv: string): string => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
  return '';
};

// Expiry date validation (MM/YY format)
export const validateExpiryDate = (expiryDate: string): string => {
  if (!expiryDate) return 'Expiry date is required';

  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) return 'Invalid format (use MM/YY)';

  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return 'Card has expired';
  }

  return '';
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): string => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return '';
};

// Format credit card number with spaces
export const formatCardNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  const groups = digitsOnly.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digitsOnly;
};

// Format expiry date
export const formatExpiryDate = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length >= 2) {
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
  }
  return digitsOnly;
};

// Validate shipping form
export const validateShippingForm = (data: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  const firstNameError = validateRequired(data.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(data.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  const addressError = validateRequired(data.address, 'Address');
  if (addressError) errors.address = addressError;

  const cityError = validateRequired(data.city, 'City');
  if (cityError) errors.city = cityError;

  const stateError = validateRequired(data.state, 'State');
  if (stateError) errors.state = stateError;

  const zipError = validateZipCode(data.zipCode);
  if (zipError) errors.zipCode = zipError;

  const countryError = validateRequired(data.country, 'Country');
  if (countryError) errors.country = countryError;

  return errors;
};

// Validate billing form
export const validateBillingForm = (data: any): ValidationErrors => {
  if (data.sameAsShipping) return {};

  const errors: ValidationErrors = {};

  const firstNameError = validateRequired(data.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(data.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const addressError = validateRequired(data.address, 'Address');
  if (addressError) errors.address = addressError;

  const cityError = validateRequired(data.city, 'City');
  if (cityError) errors.city = cityError;

  const stateError = validateRequired(data.state, 'State');
  if (stateError) errors.state = stateError;

  const zipError = validateZipCode(data.zipCode);
  if (zipError) errors.zipCode = zipError;

  const countryError = validateRequired(data.country, 'Country');
  if (countryError) errors.country = countryError;

  return errors;
};

// Validate payment form
export const validatePaymentForm = (data: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  const cardNumberError = validateCreditCard(data.cardNumber);
  if (cardNumberError) errors.cardNumber = cardNumberError;

  const cardholderError = validateRequired(data.cardholderName, 'Cardholder name');
  if (cardholderError) errors.cardholderName = cardholderError;

  const expiryError = validateExpiryDate(data.expiryDate);
  if (expiryError) errors.expiryDate = expiryError;

  const cvvError = validateCVV(data.cvv);
  if (cvvError) errors.cvv = cvvError;

  return errors;
};
