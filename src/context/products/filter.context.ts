import FilterContextProps from './filter.context.props';
import { createContext } from 'react';

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export default FilterContext;
