import { createContext } from 'react';
import { Place } from '../types/place';
const PlacesContext = createContext<Place[]>([]);
export default PlacesContext;
