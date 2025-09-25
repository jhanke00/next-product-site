'use client';

import React, { useState } from 'react';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (range: number[]) => void;
}

export const Slider = ({ minPrice, maxPrice, onPriceChange }: PriceSliderProps) => {
  const [minValue, setMinValue] = useState<number>(minPrice);
  const [maxValue, setMaxValue] = useState<number>(maxPrice);

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxValue);
    setMinValue(value);
    onPriceChange([value, maxValue]);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minValue);
    setMaxValue(value);
    onPriceChange([minValue, value]);
  };

  return (
    <>
      <h3 className='font-medium mb-2'>Price</h3>
      <div className='flex items-center'>
        <input
          data-testid='slider'
          type='range'
          min={minPrice}
          max={maxPrice}
          value={minValue}
          onChange={handleMinChange}
          className='range-slider min-range w-full h-2 bg-blue-500 rounded-l-lg'
        />
      </div>
      <div className='flex justify-between mt-2'>
        <span>${minValue.toFixed(2)}</span>
        <span>${maxValue.toFixed(2)}</span>
      </div>
    </>
  );
};
