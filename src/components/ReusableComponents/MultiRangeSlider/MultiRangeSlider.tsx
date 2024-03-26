import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from './MultiRangeSlider.module.css';

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  label?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  label,
  unit = '',
  onChange,
  minValue,
  maxValue,
}) => {
  const [minVal, setMinVal] = useState<number>(min);
  const [maxVal, setMaxVal] = useState<number>(max);
  const minValRef = useRef<number>(min);
  const maxValRef = useRef<number>(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange(minVal, maxVal);
  }, [minVal, maxVal]);

  useEffect(() => {
    if (minValue) {
      setMinVal(minValue);
    }
    if (maxValue) {
      setMaxVal(maxValue);
    }
  }, [maxValue, minValue]);

  console.log({ minVal, maxVal });

  return (
    <div className='mt-4'>
      {label && <label className='mb-2 block'>{label}</label>}
      <div className={styles.container}>
        <input
          type='range'
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className={`${styles.thumb} ${styles.thumbLeft}`}
          style={{ zIndex: minVal > max - 100 ? '5' : undefined }}
        />
        <input
          type='range'
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className={`${styles.thumb} ${styles.thumbRight}`}
        />

        <div className={styles.slider}>
          <div className={styles.sliderTrack} />
          <div ref={range} className={styles.sliderRange} />
          <div className={styles.sliderLeftValue}>
            {unit}
            {minVal}
          </div>
          <div className={styles.sliderRightValue}>
            {unit}
            {maxVal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
