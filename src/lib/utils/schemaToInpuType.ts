import { type ZodTypeAny } from 'zod';

export function schemaToHtmlInputType(schema: ZodTypeAny) {
	const underlyingType =
		'innerType' in schema._def ?
			schema._def.innerType._def.typeName
		:	schema._def.typeName;
	return (
		underlyingType === 'ZodString' ? 'text'
		: underlyingType === 'ZodNumber' ? 'number'
		: underlyingType === 'ZodBoolean' ? 'checkbox'
		: underlyingType === 'ZodDate' ? 'date'
		: 'text'
	);
}
