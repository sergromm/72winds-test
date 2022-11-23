import './styles.scss';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { ValueCellProps, RowData } from './types';
import {
	API,
	addRowAtom,
	rowsAtom,
	newRowAtom,
	removeRowAtom,
	addChildFolderAtom,
	addChildFileAtom,
	createRowsLookup,
} from './services';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	OutlinedInput,
	Box,
	CircularProgress,
} from '@mui/material';

import { ReactComponent as TrashIcon } from '../../assets/delete.svg';
import { ReactComponent as Folder1 } from '../../assets/folder-level-1.svg';
import { ReactComponent as Folder2 } from '../../assets/folder-level-2.svg';
import { ReactComponent as File } from '../../assets/file.svg';

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

interface RowProps extends RowData {
	parentId?: number;
}

function Row(props: RowProps) {
	const {
		id,
		rowName,
		salary,
		equipmentCosts,
		overheads,
		estimatedProfit,
		child,
		parentId,
		level,
	} = props;
	const [isEditMode, setIsEditMode] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [, addRow] = useAtom(addRowAtom);
	const [, addChildFile] = useAtom(addChildFileAtom);
	const [, addChildFolder] = useAtom(addChildFolderAtom);
	const [, removeRow] = useAtom(removeRowAtom);

	useEffect(() => {
		setIsEditMode(false);
	}, []);

	const rowIcon = (level: number) => {
		switch (level) {
			case 0:
				return (
					<button
						onClick={() => addRow()}
						className={`button main-button level-${level} ${
							level > 0 ? 'child' : ''
						}`}>
						<Folder1 className='button-icon folder icon' />
					</button>
				);
			case 1:
				return (
					<button
						onClick={() => addChildFolder(parentId || id)}
						className={`button main-button level-${level} ${
							level > 0 ? 'child' : ''
						}`}>
						<Folder2 className='button-icon folder icon' />
					</button>
				);
			case 2:
				return (
					<button
						onClick={() => addChildFile(parentId || id)}
						className={`button main-button level-${level} ${
							level > 0 ? 'child' : ''
						}`}>
						<File className='button-icon file icon' />
					</button>
				);
		}
	};
	return (
		<>
			<TableRow
				key={id}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
				<TableCell
					sx={{ color: 'white', padding: 0 }}
					className='buttons-cell'
					component='th'
					scope='row'>
					{rowIcon(level)}
					<Box className={`buttons-container ${isVisible ? 'active' : ''}`}>
						<button className='button'>
							<Folder2
								className='button-icon folder '
								onClick={() => addChildFolder(parentId || id)}
							/>
						</button>
						<button className='button'>
							<File
								className='button-icon file'
								onClick={() => addChildFile(parentId || id)}
							/>
						</button>
						<button className='button'>
							<TrashIcon
								className='button-icon delete'
								onClick={() => removeRow(id)}
							/>
						</button>
					</Box>
				</TableCell>
				<ValueCell isEditMode={isEditMode} value={rowName} />
				<ValueCell isEditMode={isEditMode} value={salary} />
				<ValueCell isEditMode={isEditMode} value={equipmentCosts} />
				<ValueCell isEditMode={isEditMode} value={overheads} />
				<ValueCell isEditMode={isEditMode} value={estimatedProfit} />
			</TableRow>
			{child.map((row) => (
				<Row parentId={id} key={row.id} {...row} />
			))}
		</>
	);
}

const titles = [
	'Уровень',
	'Наименование',
	'Основная з/п',
	'Оборудование',
	'Накладные расходы',
	'Сметная прибыль',
];

function TableHeader() {
	return (
		<TableHead>
			<TableRow className='table-row'>
				{titles.map((title) => (
					<TableCell key={title} className='table-cell'>
						{title}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export default function MainTabel() {
	const [rows, rowsSet] = useAtom(rowsAtom);
	const [newRow] = useAtom(newRowAtom);
	const query = useQuery({
		queryKey: ['rows'],
		queryFn: () => API.getRows(rowsSet),
	});

	createRowsLookup(rows);

	return (
		<Box
			display='flex'
			alignContent='center'
			justifyContent='center'
			sx={{ padding: '0 10px' }}>
			{query.isLoading ? (
				<CircularProgress />
			) : (
				<Table aria-label='simple table'>
					<TableHeader />
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row) => <Row key={row.id} {...row} />)
						) : (
							<Row {...newRow} />
						)}
					</TableBody>
				</Table>
			)}
		</Box>
	);
}
