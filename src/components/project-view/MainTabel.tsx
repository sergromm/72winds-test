import './styles.scss';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	OutlinedInput,
	Box,
} from '@mui/material';
import {
	ValueCellProps,
	RowProps,
	RowData,
	RowValues,
	TableStore,
} from './types';
import { store } from './services';

const API = {
	testJSON: 'https://raw.githubusercontent.com/sergromm/raws/master/index.json',
};

function createData(
	id: number,
	name: string,
	basicSalary: number,
	equipment: number,
	overheads: number,
	income: number,
) {
	return { id, name, basicSalary, equipment, overheads, income };
}

function ValueCell({ isEditMode, value }: ValueCellProps) {
	return (
		<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
			{isEditMode ? (
				<OutlinedInput className='edit-input' defaultValue={value} />
			) : (
				value
			)}
		</TableCell>
	);
}

function Row({ row }: RowProps) {
	const [isEditMode, setIsEditMode] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const { rows, add, remove } = useSnapshot<TableStore>(store);
	return (
		<TableRow
			key={row.name}
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
			<TableCell
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				sx={{ color: 'white', padding: 0 }}
				component='th'
				scope='row'>
				<FolderCopyIcon
					className={`icon ${isVisible ? 'active' : ''}`}
					onClick={() => {
						add(createData(rows.length, 'Фундаментальные работы', 0, 0, 0, 0));
					}}
				/>
				<Box className={`icons-container ${isVisible ? 'active' : ''}`}>
					<FolderCopyIcon />
					<TextSnippetIcon />
					<DeleteIcon onClick={() => remove(row.id)} />
				</Box>
			</TableCell>
			<ValueCell isEditMode={isEditMode} value={row.name} />
			<ValueCell isEditMode={isEditMode} value={row.basicSalary} />
			<ValueCell isEditMode={isEditMode} value={row.equipment} />
			<ValueCell isEditMode={isEditMode} value={row.overheads} />
			<ValueCell isEditMode={isEditMode} value={row.income} />
		</TableRow>
	);
}

// const rows = [
// 	createData('Южная строительная площадка', 0, 0, 0, 0),
// 	createData('Фундаментальные работы', 0, 0, 0, 0),
// ];

export default function MainTabel() {
	const { rows } = useSnapshot<TableStore>(store);
	const formatTableData = (data: RowData): RowValues => {
		return {
			id: data.id,
			name: data.rowName,
			basicSalary: data.salary,
			equipment: data.equipmentCosts,
			overheads: data.overheads,
			income: data.estimatedProfit,
		};
	};
	const onLoad = () => {
		fetch(API.testJSON)
			.then((res) => res.json())
			.then((data) => (store.rows = data.map(formatTableData)));
	};
	useEffect(onLoad, []);

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
						<Row row={row} />
					))}
				</TableBody>
			</Table>
		</Box>
	);
}
