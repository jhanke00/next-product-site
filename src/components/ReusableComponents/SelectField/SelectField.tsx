import React, { useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const SelectField: React.FC<SelectFieldProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <>
      {label && <label className='mb-2 block'>{label}</label>}
      <div className='relative'>
        <button
          type='button'
          className='w-full py-3 px-4 pl-3 pr-10 text-left bg-gray-700 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          onClick={handleToggle}
        >
          {options.find((option) => option.value === value)?.label}
          <svg
            className={`absolute w-5 h-5 text-gray-400 right-3 top-4 ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        {isOpen && (
          <div className='absolute z-20 w-full mt-1 bg-gray-700 rounded shadow-lg'>
            <ul className='py-1 overflow-auto text-base rounded max-h-60 focus:outline-none' tabIndex={-1}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`${
                    option.value === value ? 'text-blue-600' : 'text-gray-100'
                  } cursor-default select-none relative py-2 pl-3 pr-9`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className='block truncate'>{option.label}</span>
                  {option.value === value && (
                    <span className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <svg
                        className='w-5 h-5 text-blue-600'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path
                          fillRule='evenodd'
                          d='M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectField;
