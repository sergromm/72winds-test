import { OutlinedInput, TableCell } from '@mui/material';
import { useState } from 'react';
import { ValueCellProps } from '../../types';

export default function ValueCell({
	value,
	handleChange,
	handleSubmit,
	name,
	isEditMode,
}: ValueCellProps) {
	const [val, setValue] = useState(value);

	return (
		<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
			{isEditMode ? (
				<OutlinedInput
					error={value === ''}
					className='edit-input'
					defaultValue={val}
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
