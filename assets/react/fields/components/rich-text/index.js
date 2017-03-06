/**
 * The external dependencies.
 */
import React, { PropTypes } from 'react';
import { compose, withHandlers, setStatic } from 'recompose';
import { isString } from 'lodash';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import RichTextEditor from 'fields/components/rich-text/editor';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';
import { TYPE_RICH_TEXT } from 'fields/constants';

/**
 * Render a field that supports the build-in WYSIWYG editor.
 *
 * @param  {Object} props
 * @param  {String} props.name
 * @param  {Object} props.field
 * @return {React.Element}
 */
export const RichTextField = ({ name, field, handleChange }) => {
	return <Field field={field}>
		<RichTextEditor id={field.id} richEditing={field.rich_editing} onChange={handleChange}>
			<textarea
				id={field.id}
				className="wp-editor-area"
				name={name}
				value={field.value}
				onChange={handleChange}
				disabled={!field.ui.is_visible} />
		</RichTextEditor>
	</Field>;
};

/**
 * Validate the props.
 *
 * @type {Object}
 */
RichTextField.propTypes = {
	name: PropTypes.string.isRequired,
	field: PropTypes.shape({
		id: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired,
	}).isRequired,
	handleChange: PropTypes.func.isRequired,
};

/**
 * Sync the input value with the store.
 *
 * @param  {Object}   props
 * @param  {Object}   props.field
 * @param  {Function} props.updateField
 * @return {Function}
 */
const handleChange = ({ field, updateField }) => eventOrValue => {
	let value;

	if (isString(eventOrValue)) {
		value = eventOrValue;
	} else {
		value = eventOrValue.target.value;
	}

	updateField(field.id, { value });
};

export default setStatic('type', [TYPE_RICH_TEXT])(
	compose(
		withStore(),
		withSetup(),
		withHandlers({ handleChange })
	)(RichTextField)
);
