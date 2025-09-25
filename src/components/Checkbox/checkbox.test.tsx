import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '.';

describe('Checkbox', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    render(<Checkbox label='Option 1' onChange={mockOnChange} />);
  });

  test('changes state on click', () => {
    const checkbox = screen.getByLabelText(/Option 1/i);
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });
});
