import './styles.scss';
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useState,
} from 'react';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
	updateRowArom,
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

function ValueCell({
	value,
	handleChange,
	handleSubmit,
	name,
	isEditMode,
}: ValueCellProps) {
	return (
		<TableCell sx={{ color: 'white', padding: 0 }} align='left'>
			{isEditMode ? (
				<OutlinedInput
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

function countChildren(children: RowData[], counter = 0): number {
	children.forEach((child) => {
		counter += 1;
		if (child.child) {
			counter = countChildren(child.child, counter);
		}
	});
	return counter;
}

interface RowIconProps {
	handleClick: (e: MouseEvent) => void;
	level: number;
	height: number;
	childrenCounter: number;
	icon: JSX.Element;
}

function RowIcon(props: RowIconProps) {
	const { handleClick, level, height, childrenCounter, icon } = props;
	return (
		<button
			onClick={handleClick}
			className={`button main-button level-${level} ${
				level > 0 ? 'child' : ''
			}`}>
			{icon}
			<div
				style={{
					width: '1px',
					height: height + 'px',
					borderLeft: 'thin solid #c6c6c6',
					transform: 'translateY(100%)',
					position: 'absolute',
					bottom: '5px',
					display: `${childrenCounter === 0 ? 'none' : 'block'}`,
				}}
			/>
		</button>
	);
}

interface RowProps extends RowData {
	parentId?: number;
}

interface LevelContent<T> {
	[key: number]: T;
}

const levelLineLength = (counter: number) => 40 + 47 * (counter - 1);

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
	const [childrenCounter, setChildrenCounter] = useState(0);
	const [, addRow] = useAtom(addRowAtom);
	const [, addChildFile] = useAtom(addChildFileAtom);
	const [, addChildFolder] = useAtom(addChildFolderAtom);
	const [, removeRow] = useAtom(removeRowAtom);
	const [, updateRow] = useAtom(updateRowArom);
	const [isEditMode, setIsEditMode] = useState(false);
	const [rowValues, setRowValues] = useState({
		rowName,
		salary,
		equipmentCosts,
		overheads,
		estimatedProfit,
	});

	function handleInputChange(e: ChangeEvent) {
		const { name, value } = e.target as HTMLInputElement;
		setRowValues({
			...rowValues,
			[name]: value,
		});
	}

	function handleSubmit(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			updateRow({ ...rowValues, id });
			setIsEditMode(false);
		}
	}

	const icons: LevelContent<JSX.Element> = {
		0: <Folder1 className='button-icon folder icon' />,
		1: <Folder2 className='button-icon folder icon' />,
		2: <File className='button-icon file icon' />,
	};

	const handlers: LevelContent<() => void> = {
		0: () => {
			addRow();
		},
		1: () => {
			addChildFolder(parentId || id);
		},
		2: () => {
			addChildFile(parentId || id);
		},
	};

	const buttonContainerWidth: LevelContent<string> = {
		0: '66px',
		1: '42px',
		2: '28px',
	};

	useEffect(() => {
		setChildrenCounter(child.length > 1 ? countChildren(child) : child.length);
	}, [child]);

	return (
		<>
			<TableRow
				key={id}
				onDoubleClick={() => setIsEditMode((prev) => !prev)}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
				<TableCell
					sx={{ color: 'white', padding: 0 }}
					className='buttons-cell'
					component='th'
					scope='row'>
					<RowIcon
						level={level}
						handleClick={handlers[level]}
						icon={icons[level]}
						height={levelLineLength(childrenCounter)}
						childrenCounter={childrenCounter}
					/>
					<Box
						className={`buttons-container level-${level}`}
						style={{
							width: buttonContainerWidth[level],
						}}>
						<button className={`button ${level > 0 ? 'hidden' : 'visible'}`}>
							<Folder2
								className='button-icon folder '
								onClick={() => addChildFolder(id)}
							/>
						</button>
						<button className={`button ${level > 1 ? 'hidden' : 'visible'}`}>
							<File
								className='button-icon file'
								onClick={() => addChildFile(id)}
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
				<ValueCell
					isEditMode={isEditMode}
					handleSubmit={handleSubmit}
					handleChange={handleInputChange}
					value={rowName}
					name='rowName'
				/>
				<ValueCell
					isEditMode={isEditMode}
					handleSubmit={handleSubmit}
					handleChange={handleInputChange}
					value={salary}
					name='salary'
				/>
				<ValueCell
					isEditMode={isEditMode}
					handleSubmit={handleSubmit}
					handleChange={handleInputChange}
					value={equipmentCosts}
					name='equipmentCosts'
				/>
				<ValueCell
					isEditMode={isEditMode}
					handleSubmit={handleSubmit}
					handleChange={handleInputChange}
					value={overheads}
					name='overheads'
				/>
				<ValueCell
					isEditMode={isEditMode}
					handleSubmit={handleSubmit}
					handleChange={handleInputChange}
					value={estimatedProfit}
					name='estimatedProfit'
				/>
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
			<ReactQueryDevtools />
		</Box>
	);
}
