import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from '.';

describe('Slider', () => {
  const mockOnPriceChange = jest.fn();

  beforeEach(() => {
    render(<Slider minPrice={0} maxPrice={1000} onPriceChange={mockOnPriceChange} />);
  });

  test('change value', () => {
    const slider = screen.getByTestId('slider');
    fireEvent.change(slider, { target: { value: '200' } });

    expect(mockOnPriceChange).toHaveBeenCalledWith([200, 1000]);
  });
});
