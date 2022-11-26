import { OutlinedInput, TableCell } from '@mui/material';
import { useState } from 'react';
import { ValueCellProps } from '../../types';

export default function ValueCell({
	value,
	handleChange,
	handleSubmit,
	isEditMode,
	handleDoubleClick,
	name,
}: // handleDoubleClick,
ValueCellProps) {
	return (
		<TableCell
			onDoubleClick={handleDoubleClick}
			// onKeyDown={}
			sx={{ color: 'white', padding: 0 }}
			align='left'>
			{isEditMode ? (
				<OutlinedInput
					error={value === ''}
					className='edit-input'
					defaultValue={value}
					onChange={handleChange}
					onKeyDown={handleSubmit}
					name={name}
				/>
			) : (
				value
			)}
		</TableCell>
	);
}
