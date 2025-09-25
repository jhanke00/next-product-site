import React, { useState } from 'react';

interface CheckboxProps {
  label: string;
  isChecked?: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ label, isChecked = false, onChange }: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <>
      <input
        id={label}
        type='checkbox'
        checked={checked}
        onChange={handleCheckboxChange}
        className='form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
      />
      <label htmlFor={label} className='ml-2 text-sm'>
        {label}
      </label>
    </>
  );
};
