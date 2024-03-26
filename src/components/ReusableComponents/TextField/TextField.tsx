import React, { ChangeEvent, InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, error, ...inputProps }) => {
  const hasError = !!error;

  return (
    <div className='md:mb-0'>
      {label && (
        <label htmlFor={inputProps.name} className='block tracking-wide mb-2'>
          {label}
        </label>
      )}
      <input
        className={`appearance-none block w-full bg-gray-700 text-white rounded py-3 px-4 leading-tight focus:outline-none color-white focus:bg-black bg-black ${
          hasError ? 'border border-red-500' : ''
        }`}
        {...inputProps}
      />
      {hasError && <p className='text-red-500 text-xs italic'>{error}</p>}
    </div>
  );
};

export default TextField;
