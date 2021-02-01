import { createContext } from 'react';
import { Field } from '@shopify/react-form';

export type Fields = { [key: string]: Field<any> };
export interface FormContextContents {
	fields: Fields;
	count: number;
	multi: boolean;
}
/** Object of feature information that passes between all components  */
export const FormContext = createContext<FormContextContents>({
	fields: {},
	count: 1,
	multi: false,
});
