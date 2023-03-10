import { createContext, useContext } from 'react';

export const FormFieldContext = createContext<{
  id?: string;
  invalid: boolean;
  error?: boolean | string;
  inlineLabel?: boolean;
}>({
  invalid: false,
});

export const useFormFieldContext = () => useContext(FormFieldContext);
