import React, { useCallback, useState, useEffect } from 'react';
import {
	Autocomplete,
	Stack,
	Tag,
	TextContainer,
	TextField,
	Button,
	InlineError,
	Banner,
} from '@shopify/polaris';
import { Field } from '@shopify/react-form';

interface TagEditorProps {
	field: Field<any>;
	clearField: Field<any>;
	helpText: string;
	selectedTags: string[];
	title: string;
	suggestedTags: { value: string; label: string }[];
	errorMessage: string;
	multi: boolean;
}

export function TagEditor({
	field,
	clearField,
	helpText,
	selectedTags,
	title,
	suggestedTags,
	errorMessage,
	multi,
}: TagEditorProps) {
	const selected = selectedTags.filter(tag => tag.trim() !== '');
	/** Selected tags */
	const [selectedOptions, setSelectedOptions] = useState(selected);
	/** Value in the text field */
	const [inputValue, setInputValue] = useState('');
	/** Filtered list of suggested tags based on value in text field */
	const [options, setOptions] = useState(suggestedTags);

	let clearFieldWarning = null;

	useEffect(() => {
		setOptions(suggestedTags);
	}, [suggestedTags]);

	useEffect(() => {
		field.onChange(selectedOptions);
	}, [selectedOptions]);

	const handleClearTags = useCallback(() => {
		field.onChange([]);
		clearField.onChange(true);
		setSelectedOptions([]);
		clearFieldWarning = getClearFieldWarning(true, selectedOptions, true);
	}, [selectedOptions, field, clearField]);

	/** Runs through updateText(), every time user updates the text field*/
	const updateText = useCallback(
		value => {
			setInputValue(value);
			if (value === '') {
				/** If input is empty, all deselected options will show in the drop down*/
				setOptions(suggestedTags);
				return;
			}
			/** If text input has a space at the end of the string, add text as a new tag */
			if (value.endsWith(' ')) {
				value = value.split(' ');
				if (!selectedOptions.includes(value[0]) && value[0] !== '') {
					setSelectedOptions(selectedOptions => [...selectedOptions, value[0]]);
					/** After creating the tag, text field resets */
					setInputValue('');
					setOptions(suggestedTags);
					return;
				} else {
					/**  If user tries to submit a tag that already exists, the text field resets*/
					setInputValue('');
					setOptions(suggestedTags);
				}
			}
			/**  Filter the tag options based on autocomplete*/
			const resultOptions = suggestedTags.filter(option => option.label.includes(value));
			let endIndex = resultOptions.length - 1;
			if (resultOptions.length === 0) {
				endIndex = 0;
			}
			setOptions(resultOptions);
		},
		[[selectedOptions, suggestedTags]],
	);

	const removeTag = useCallback(
		tag => () => {
			const options = [...selectedOptions];
			options.splice(options.indexOf(tag), 1);
			setSelectedOptions(options);
		},
		[selectedOptions],
	);

	const tagsMarkup = selectedOptions.map(option => {
		return (
			<Tag key={`option${option}`} onRemove={removeTag(option)}>
				{option}
			</Tag>
		);
	});

	const textField = (
		<Autocomplete.TextField
			onChange={updateText}
			label={title}
			value={inputValue}
			helpText={helpText}
			error={Boolean(errorMessage)}
		/>
	);

	return (
		<div>
			<Autocomplete
				allowMultiple
				options={options}
				selected={selectedOptions}
				textField={textField}
				onSelect={setSelectedOptions}
				listTitle="Suggested Tags"
			/>
			{errorMessage && <InlineError message={errorMessage} fieldID={'tagField'} />}
			<br />
			<TextContainer>
				<Stack>{tagsMarkup}</Stack>
			</TextContainer>
			<Button plain onClick={handleClearTags}>
				Clear tags
			</Button>
			{getClearFieldWarning(clearField.value, selectedOptions, multi)}
		</div>
	);
}

export function getClearFieldWarning(clearField, selectedOptions, multi) {
	if (multi) {
		if (clearField && selectedOptions.length === 0) {
			return (
				<Banner title="Warning" status="warning">
					<p>Tags for this selected feature will be deleted</p>
				</Banner>
			);
		}
	}
	return null;
}
