import './styles.scss';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { ValueCellProps, RowData } from './types';
import {
	API,
	addRowAtom,
	rowsAtom,
	newRowAtom,
	removeRowAtom,
	addChildFolderAtom,
	addChildFileAtom,
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

	return (
		<>
			<TableRow
				key={id}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
				<TableCell
					onMouseEnter={() => setIsVisible(true)}
					onMouseLeave={() => setIsVisible(false)}
					sx={{ color: 'white', padding: 0 }}
					component='th'
					scope='row'>
					<FolderCopyIcon
						className={`icon ${isVisible ? 'active' : ''}`}
						onClick={() => addRow()}
					/>
					<Box className={`icons-container ${isVisible ? 'active' : ''}`}>
						<FolderCopyIcon onClick={() => addChildFolder(parentId || id)} />
						<TextSnippetIcon onClick={() => addChildFile(parentId || id)} />
						<DeleteIcon onClick={() => removeRow(id)} />
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
