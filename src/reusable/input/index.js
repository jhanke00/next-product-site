//propTypes to be added for Javacript

import FormElementError from '../formError';

import './input.css';

export default function InputText({
  onChange = () => {},
  name = '',
  value = '',
  required = false,
  label = '',
  type = 'text',
  inputClassName = '',
  labelClassName = '',
  error = null,
  ...restProps
}) {
  return (
    <>
      <label htmlFor={name} className={`${labelClassName} my-2`}>
        {label}
      </label>
      <input
        type={type}
        className={`input-text ${inputClassName} ${error?.type ? 'input-form-error' : ''}`}
        name={name}
        onChange={onChange}
        value={value}
        required={required}
        {...restProps}
      />
      {error?.type && <FormElementError error={error} errorId={`${name}_err_span`} />}
    </>
  );
}