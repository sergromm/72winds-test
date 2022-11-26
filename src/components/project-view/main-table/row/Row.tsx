import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { RowProps, LevelContent, UpdateRowPayload } from '../../types';
import { useAtom } from 'jotai';
import { ReactComponent as TrashIcon } from '../../../../assets/delete.svg';
import { ReactComponent as Folder1 } from '../../../../assets/folder-level-1.svg';
import { ReactComponent as Folder2 } from '../../../../assets/folder-level-2.svg';
import { ReactComponent as File } from '../../../../assets/file.svg';
import { TableRow, TableCell, Box } from '@mui/material';
import { countChildren, levelLineLength } from '../utils';
import {
	addChildRowAtom,
	addRowAtom,
	API,
	removeRowAtom,
	updateRowAtom,
} from '../../services';
import RowIcon from './RowIcon';
import ValueCell from './ValueCell';

const buttonContainerWidth: LevelContent<string> = {
	0: '66px',
	1: '42px',
	2: '28px',
};

const icons: LevelContent<JSX.Element> = {
	0: <Folder1 className='button-icon folder icon' />,
	1: <Folder2 className='button-icon folder icon' />,
	2: <File className='button-icon file icon' />,
};

const cells = [
	{ name: 'rowName' },
	{ name: 'salary' },
	{ name: 'equipmentCosts' },
	{ name: 'overheads' },
	{ name: 'estimatedProfit' },
];

const initialRowValues = {
	equipmentCosts: 0,
	estimatedProfit: 0,
	machineOperatorSalary: 0,
	mainCosts: 0,
	materials: 0,
	mimExploitation: 0,
	overheads: 0,
	rowName: 'Новая строка',
	salary: 0,
	supportCosts: 0,
};

export default function Row(props: RowProps) {
	const { id, child, parentId, level, passedParentId, ...rest } = props;

	const [childrenCounter, setChildrenCounter] = useState(0);
	const [isEditMode, setIsEditMode] = useState(false);
	const [rowValues, setRowValues] = useState(rest);

	const [, addRow] = useAtom(addRowAtom);
	const [, addChildRow] = useAtom(addChildRowAtom);
	const [, removeRow] = useAtom(removeRowAtom);
	const [, updateRow] = useAtom(updateRowAtom);

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

			API.updateRow({
				data: rowValues,
				setter: updateRow,
				id,
			});

			setIsEditMode(false);
		}
	}

	function withEditMode(fun: () => void) {
		if (!isEditMode) {
			fun();
		}
	}

	// TODO: привести добавление к одной функции addNewRow

	function handleAddParentFolder() {
		addRow({
			rowName: 'Новая строка',
			equipmentCosts: 0,
			estimatedProfit: 0,
			overheads: 0,
			salary: 0,
			level,
		});

		API.createRow({ ...initialRowValues, parentId: null });
	}
	// TODO: привести добавление к одной функции addNewRow

	function handleAddChildRow(rowId: number = passedParentId) {
		console.dir({ id, parentId, passedParentId });
		addChildRow(rowId);
		API.createRow({
			parentId: rowId,
			...rowValues,
			rowName: 'Новая строка',
		});
	}

	function handleDoubleClick() {
		setIsEditMode((prev) => !prev);
	}

	const handlers: LevelContent<() => void> = {
		0: () => withEditMode(handleAddParentFolder),
		1: () => withEditMode(handleAddChildRow),
		2: () => withEditMode(handleAddChildRow),
	};

	useEffect(() => {
		setChildrenCounter(countChildren(child));
	}, [child]);

	return (
		<>
			<TableRow key={id} className='table-body-row'>
				<TableCell className='buttons-cell' component='th' scope='row'>
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
						<button
							onClick={() => handleAddChildRow(id)}
							className={`button ${level > 0 ? 'hidden' : 'visible'}`}>
							<Folder2 className='button-icon folder ' />
						</button>

						<button
							onClick={() => handleAddChildRow(id)}
							className={`button ${level > 1 ? 'hidden' : 'visible'}`}>
							<File className='button-icon file' />
						</button>

						<button
							onClick={() => {
								removeRow(id);
								API.deleteRow(id);
							}}
							className='button'>
							<TrashIcon className='button-icon delete' />
						</button>
					</Box>
				</TableCell>

				{cells.map(({ name }) => (
					<ValueCell
						id={id}
						key={name}
						isEditMode={isEditMode}
						handleSubmit={handleSubmit}
						handleChange={handleInputChange}
						handleDoubleClick={handleDoubleClick}
						value={props[name]}
						name={name}
					/>
				))}
			</TableRow>
			{child.map((row) => (
				<Row passedParentId={id} key={row.id} {...row} />
			))}
		</>
	);
}
