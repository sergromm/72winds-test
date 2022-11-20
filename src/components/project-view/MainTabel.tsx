import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	OutlinedInput,
	Box,
} from '@mui/material';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

function createData(
	name: string,
	calories: number,
	fat: number,
	carbs: number,
	protein: number,
	income: number,
) {
	return { name, fat, carbs, protein, income };
}

const rows = [createData('Южная строительная площадка', 0, 0, 0, 0, 0)];

export default function MainTabel() {
	const [isEditMode, setIsEditMode] = useState(true);
	return (
		<Box sx={{ padding: '0 10px' }}>
			<Table
				sx={{ minWidth: 650, width: '100%', padding: '0 24px' }}
				aria-label='simple table'>
				<TableHead>
					<TableRow className='table-row'>
						<TableCell className='table-cell'>Уровень</TableCell>
						<TableCell className='table-cell'>Наименование работ</TableCell>
						<TableCell className='table-cell'>Основная з/п</TableCell>
						<TableCell className='table-cell'>Оборудование</TableCell>
						<TableCell className='table-cell'>Накладные расходы</TableCell>
						<TableCell className='table-cell'>Сметная прибыль</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.name}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
							<TableCell
								sx={{ color: 'white', padding: 0 }}
								component='th'
								scope='row'>
								<FolderCopyIcon onClick={() => setIsEditMode(!isEditMode)} />
							</TableCell>
							<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
								{isEditMode ? (
									<OutlinedInput
										className='edit-input'
										defaultValue={row.name}
									/>
								) : (
									row.name
								)}
							</TableCell>
							<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
								{isEditMode ? (
									<OutlinedInput
										className='edit-input'
										defaultValue={row.fat}
									/>
								) : (
									row.fat
								)}
							</TableCell>
							<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
								{isEditMode ? (
									<OutlinedInput
										className='edit-input'
										defaultValue={row.carbs}
									/>
								) : (
									row.carbs
								)}
							</TableCell>
							<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
								{isEditMode ? (
									<OutlinedInput
										className='edit-input'
										defaultValue={row.protein}
									/>
								) : (
									row.protein
								)}
							</TableCell>
							<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
								{isEditMode ? (
									<OutlinedInput
										className='edit-input'
										defaultValue={row.income}
									/>
								) : (
									row.income
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	);
}
