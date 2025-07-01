import { useReducer } from "react";

// Types for search form state
export interface SearchFormState {
  query: string;
  cardType: string;
  colors: string[];
  powerMin: number;
  powerMax: number;
  toughnessMin: number;
  toughnessMax: number;
  cmcMin: number;
  cmcMax: number;
}

export interface SearchFormDefaults {
  powerMin: number;
  powerMax: number;
  toughnessMin: number;
  toughnessMax: number;
  cmcMin: number;
  cmcMax: number;
}

// Action types for the reducer
type SearchFormAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_CARD_TYPE'; payload: string }
  | { type: 'SET_COLORS'; payload: string[] }
  | { type: 'SET_POWER_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_TOUGHNESS_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_CMC_RANGE'; payload: { min: number; max: number } }
  | { type: 'RESET_TO_DEFAULTS'; payload: SearchFormDefaults };

// Default values
const DEFAULT_VALUES: SearchFormDefaults = {
  powerMin: 0,
  powerMax: 13,
  toughnessMin: 0,
  toughnessMax: 13,
  cmcMin: 0,
  cmcMax: 16,
};

// Reducer function
function searchFormReducer(state: SearchFormState, action: SearchFormAction): SearchFormState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_CARD_TYPE':
      return { ...state, cardType: action.payload };
    case 'SET_COLORS':
      return { ...state, colors: action.payload };
    case 'SET_POWER_RANGE':
      return { ...state, powerMin: action.payload.min, powerMax: action.payload.max };
    case 'SET_TOUGHNESS_RANGE':
      return { ...state, toughnessMin: action.payload.min, toughnessMax: action.payload.max };
    case 'SET_CMC_RANGE':
      return { ...state, cmcMin: action.payload.min, cmcMax: action.payload.max };
    case 'RESET_TO_DEFAULTS':
      return {
        query: '',
        cardType: '',
        colors: [],
        ...action.payload,
      };
    default:
      return state;
  }
}

// Custom hook
export function useSearchFormState(initialValues: Partial<SearchFormState> = {}) {
  const initialState: SearchFormState = {
    query: '',
    cardType: '',
    colors: [],
    ...DEFAULT_VALUES,
    ...initialValues,
  };

  const [state, dispatch] = useReducer(searchFormReducer, initialState);

  // Action creators
  const actions = {
    setQuery: (query: string) => dispatch({ type: 'SET_QUERY', payload: query }),
    setCardType: (cardType: string) => dispatch({ type: 'SET_CARD_TYPE', payload: cardType }),
    setColors: (colors: string[]) => dispatch({ type: 'SET_COLORS', payload: colors }),
    setPowerRange: (min: number, max: number) => dispatch({ type: 'SET_POWER_RANGE', payload: { min, max } }),
    setToughnessRange: (min: number, max: number) => dispatch({ type: 'SET_TOUGHNESS_RANGE', payload: { min, max } }),
    setCmcRange: (min: number, max: number) => dispatch({ type: 'SET_CMC_RANGE', payload: { min, max } }),
    resetToDefaults: () => dispatch({ type: 'RESET_TO_DEFAULTS', payload: DEFAULT_VALUES }),
  };

  // Helper to check if search should be disabled
  const isSearchDisabled = !state.query.trim() && 
    state.cardType === "" && 
    state.colors.length === 0 && 
    state.powerMin === DEFAULT_VALUES.powerMin && 
    state.powerMax === DEFAULT_VALUES.powerMax && 
    state.toughnessMin === DEFAULT_VALUES.toughnessMin && 
    state.toughnessMax === DEFAULT_VALUES.toughnessMax && 
    state.cmcMin === DEFAULT_VALUES.cmcMin && 
    state.cmcMax === DEFAULT_VALUES.cmcMax;

  return {
    state,
    actions,
    isSearchDisabled,
    defaults: DEFAULT_VALUES,
  };
}