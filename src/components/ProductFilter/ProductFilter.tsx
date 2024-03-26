import React, { useState, useEffect } from 'react';
import SelectField from '../ReusableComponents/SelectField/SelectField';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import MultiRangeSlider from '../ReusableComponents/MultiRangeSlider/MultiRangeSlider';
import TextField from '../ReusableComponents/TextField/TextField';

type ProductFilterProps = {
  categories: string[];
  minPrice: number;
  maxPrice: number;
};

const ProductFilter: React.FC<ProductFilterProps> = ({ categories, minPrice, maxPrice }) => {
  const [value, setValue] = useState('');
  const [stock, setStock] = useState(0);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const [rating, setRating] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const category = searchParams?.get('category');
    const stock = searchParams?.get('stock');
    const min = searchParams?.get('min');
    const max = searchParams?.get('max');
    setValue(category || '');
    setStock(Number(stock) || 0);
    setMin(Number(min) || minPrice);
    setMax(Number(max) || maxPrice);
  }, [searchParams]);

  const onChange = (value: string) => {
    setValue(value);
    const params = new URLSearchParams(searchParams || undefined);
    if (value) {
      params.set('category', value);
    } else [params.delete('category')];
    router.push(pathname + '?' + params.toString());
  };

  const handleChange = (min: number, max: number) => {
    setMin(min);
    setMax(max);
    const params = new URLSearchParams(searchParams || undefined);
    if (min) {
      params.set('min', min.toString());
    } else {
      params.delete('min');
    }
    if (max) {
      params.set('max', max.toString());
    } else {
      params.delete('max');
    }
    router.push(pathname + '?' + params.toString());
  };

  const handleChangeStock = (event: any) => {
    setStock(Number(event.target.value));
    const params = new URLSearchParams(searchParams || undefined);
    if (event.target.value) {
      params.set('stock', event.target.value);
    } else {
      params.delete('stock');
    }
    router.push(pathname + '?' + params.toString());
  };

  const handleChangeRating = (value: string) => {
    setRating(value);
    const params = new URLSearchParams(searchParams || undefined);

    if (value) {
      params.set('rating', value);
    } else {
      params.delete('rating');
    }
    router.push(pathname + '?' + params.toString());
  };

  return (
    <div className='py-4'>
      <div className='mt-12'>
        <SelectField
          value={value}
          label='Category'
          onChange={onChange}
          options={[
            { label: 'All', value: '' },
            ...categories.map((category) => ({ label: category, value: category })),
          ]}
        />
      </div>
      <div className='mt-12'>
        <MultiRangeSlider
          label='Price'
          min={minPrice}
          max={maxPrice}
          unit='$'
          onChange={handleChange}
          minValue={min}
          maxValue={max}
        />
      </div>

      <div className='mt-20'>
        <TextField type='number' value={stock} label='Stock' onChange={handleChangeStock} min={0} />
      </div>

      <div className='mt-12'>
        <SelectField
          value={rating}
          label='Rating'
          onChange={handleChangeRating}
          options={[
            { label: 'All', value: '' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
          ]}
        />
      </div>
    </div>
  );
};

export default ProductFilter;
