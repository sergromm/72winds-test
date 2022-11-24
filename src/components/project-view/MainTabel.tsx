import './styles.scss';
import { useEffect, useState } from 'react';
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

function ValueCell({ value }: ValueCellProps) {
	const [isEditMode, setIsEditMode] = useState(false);

	return (
		<TableCell
			onDoubleClick={() => setIsEditMode((prev) => !prev)}
			sx={{ color: 'white', padding: 0 }}
			align='left'>
			{isEditMode ? (
				<OutlinedInput className='edit-input' defaultValue={value} />
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
	handleClick: () => void;
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

interface Handlers {
	[key: number]: () => void;
}

interface Icons {
	[key: number]: JSX.Element;
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
	const [childrenCounter, setChildrenCounter] = useState(0);
	const [, addRow] = useAtom(addRowAtom);
	const [, addChildFile] = useAtom(addChildFileAtom);
	const [, addChildFolder] = useAtom(addChildFolderAtom);
	const [, removeRow] = useAtom(removeRowAtom);
	const levelLineLength = (counter: number) => 40 + 47 * (counter - 1);

	const icons: Icons = {
		0: <Folder1 className='button-icon folder icon' />,
		1: <Folder2 className='button-icon folder icon' />,
		2: <File className='button-icon file icon' />,
	};

	const handlers: Handlers = {
		0: () => addRow(),
		1: () => addChildFolder(parentId || id),
		2: () => addChildFile(parentId || id),
	};

	const buttonContainerWidth = (level: number) => {
		switch (level) {
			case 0:
				return '66px';
			case 1:
				return '42px';
			case 2:
				return '28px';
		}
	};

	useEffect(() => {
		const count = countChildren(child);
		setChildrenCounter(child.length > 1 ? countChildren(child) : child.length);
		console.log('length: ', rowName, childrenCounter);
		console.log('count: ', rowName, count);
	}, [child]);

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
							width: buttonContainerWidth(level),
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
				<ValueCell value={rowName} />
				<ValueCell value={salary} />
				<ValueCell value={equipmentCosts} />
				<ValueCell value={overheads} />
				<ValueCell value={estimatedProfit} />
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
	console.log(rows);
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
