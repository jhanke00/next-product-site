//import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ContactUsForm from './index';

describe('ContactUsForm', () => {
  test('renders ContactUsForm component', () => {
    const { getByText, getByLabelText } = render(<ContactUsForm />);
    expect(getByText('First Name:')).toBeInTheDocument();
    expect(getByLabelText('Address Line 1:')).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const { getByLabelText, getByText } = render(<ContactUsForm />);
    fireEvent.change(getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name:'), { target: { value: 'Doe' } });

    fireEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(getByText('Success')).toBeInTheDocument();
      expect(getByText('Form Successfully Submitted')).toBeInTheDocument();
    });
  });

  test('displays error message for invalid email', async () => {
    const { getByLabelText, getByText } = render(<ContactUsForm />);
    fireEvent.change(getByLabelText('E-mail:'), { target: { value: 'invalid_email' } });
    fireEvent.click(getByText('Submit'));
    await waitFor(() => {
      expect(getByText('Failed')).toBeInTheDocument();
      expect(
        getByText("Please include an '@' in the email address. 'invalid_email is missing and '@'")
      ).toBeInTheDocument();
    });
  });
});
