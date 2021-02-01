import { AjvValidator } from './ajv-validator';
import {
	AislesNameValidator,
	WorkflowPointsNameValidator,
	LogicalAreasNameValidator,
} from './unique-names-validator';
import { PolygonValidator } from './polygon-validator';

export const validators = [
	AjvValidator,
	AislesNameValidator,
	WorkflowPointsNameValidator,
	LogicalAreasNameValidator,
	PolygonValidator,
];
