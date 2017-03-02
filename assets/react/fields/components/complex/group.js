/**
 * The external dependencies.
 */
import React, { PropTypes } from 'react';
import cx from 'classnames';
import { compose, withHandlers, withState, getContext, withProps } from 'recompose';

/**
 * The internal dependencies.
 */
import { preventDefault } from 'lib/helpers';

import fieldFactory from 'fields/factory';
import { getComplexGroupLabel } from 'fields/selectors';

/**
 * Render the holder around the complex's fields.
 *
 * @param  {Object}   props
 * @param  {Number}   props.index
 * @param  {String}   props.prefix
 * @param  {String}   props.layout
 * @param  {Object}   props.group
 * @param  {String}   props.label
 * @param  {Boolean}  props.active
 * @param  {Boolean}  props.collapsed
 * @param  {Function} props.handleToggleClick
 * @param  {Function} props.handleCloneClick
 * @param  {Function} props.handleRemoveClick
 * @return {React.Element}
 *
 * TODO: Add support for custom labels.
 */
export const ComplexGroup = ({
	index,
	prefix,
	layout,
	group,
	label,
	active,
	collapsed,
	handleToggleClick,
	handleCloneClick,
	handleRemoveClick
}) => {
	const classes = [
		'carbon-row',
		'carbon-group-row',
		{ 'collapsed': collapsed },
		{ 'active': active },
	];

	return <div id={group.id} className={cx(classes)}>
		<input
			type="hidden"
			name={`${prefix}[${index}][_type]`}
			defaultValue={group.name} />

		<div className="carbon-drag-handle">
			<span className="group-number">
				{index + 1}
			</span>

			<span
				className="group-name"
				dangerouslySetInnerHTML={{ __html: label }} />
		</div>

		<div className={`carbon-group-actions carbon-group-actions-${layout}`}>
			<a
				href="#"
				className="carbon-btn-duplicate dashicons-before dashicons-admin-page"
				title={carbonFieldsL10n.field.complexCloneButton}
				onClick={handleCloneClick} >
				{carbonFieldsL10n.field.complexCloneButton}
			</a>

			<a
				href="#"
				className="carbon-btn-remove dashicons-before dashicons-trash"
				title={carbonFieldsL10n.field.complexRemoveButton}
				onClick={handleRemoveClick} >
				{carbonFieldsL10n.field.complexRemoveButton}
			</a>

			<a
				href="#"
				className="carbon-btn-collapse dashicons-before dashicons-arrow-up"
				title={carbonFieldsL10n.field.complexCollapseExpandButton}
				onClick={handleToggleClick} >
				{carbonFieldsL10n.field.complexCollapseExpandButton}
			</a>
		</div>

		<div className="fields-container">
			{
				group.fields.map(({ id, type, name }) => {
					name = `${prefix}[${index}][${name}]`;

					return fieldFactory(type, { id, name });
				})
			}
		</div>
	</div>;
};

/**
 * Validate the props.
 *
 * @type {Object}
 */
ComplexGroup.propTypes = {
	index: PropTypes.number.isRequired,
	prefix: PropTypes.string.isRequired,
	layout: PropTypes.string.isRequired,
	group: PropTypes.shape({
		name: PropTypes.string.isRequired,
		fields: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})),
	}).isRequired,
	active: PropTypes.bool.isRequired,
	onClone: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
};

/**
 * The data that should extracted from the context
 * and passed as props.
 *
 * @type {Object}
 */
const context = {
	store: PropTypes.object,
};

/**
 * Pass additional props to the component.
 *
 * @param  {Object} props
 * @param  {Object} props.group
 * @param  {Object} props.store
 * @return {Object}
 */
const props = ({ group, store }) => ({
	label: getComplexGroupLabel(store.getState(), group),
});

/**
 * Handle the click on the 'Expand/Collapse' button.
 *
 * @param  {Object}   props
 * @param  {Boolean}  props.collapsed
 * @param  {Function} props.setCollapsed
 * @return {Function}
 */
const handleToggleClick = ({ collapsed, setCollapsed }) => preventDefault(() => setCollapsed(!collapsed));

/**
 * Handle the click on the 'Clone' button.
 *
 * @param  {Object}   props
 * @param  {Object}   props.group
 * @param  {Function} props.onClone
 * @return {Function}
 */
const handleCloneClick = ({ group, onClone }) => preventDefault(() => onClone(group.id));

/**
 * Handle the click on the 'Remove' button.
 *
 * @param  {Object}   props
 * @param  {Object}   props.group
 * @param  {Function} props.onRemove
 * @return {Function}
 */
const handleRemoveClick = ({ group, onRemove }) => preventDefault(() => onRemove(group.id));

export default compose(
	getContext(context),
	withProps(props),
	withState('collapsed', 'setCollapsed', false),
	withHandlers({
		handleToggleClick,
		handleCloneClick,
		handleRemoveClick,
	})
)(ComplexGroup);

