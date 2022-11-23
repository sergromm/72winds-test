import { atom } from 'jotai';
import { RowData } from './types';

export function createData(
	id: number,
	rowName: string,
	salary: number,
	equipmentCosts: number,
	overheads: number,
	estimatedProfit: number,
	level: number,
) {
	return {
		id,
		rowName,
		salary,
		equipmentCosts,
		overheads,
		estimatedProfit,
		level,
		machineOperatorSalary: 0,
		mainCosts: 0,
		materials: 0,
		mimExploitation: 0,
		supportCosts: 0,
		total: 0,
		child: [],
	};
}

let level = 0;
function addLevelsToRows(rows: RowData[]): RowData[] {
	return rows.map((row) => ({
		...row,
		level: level++,
		child: row.child ? addLevelsToRows(row.child) : [],
	}));
}

const rowEntity = {
	id: 29955,
	rowName: '47d90b1b-f4ba-452f-8f4e-d2785fe613ff',
};

export const API = {
	testJSON: 'https://raw.githubusercontent.com/sergromm/raws/master/index.json',
	empty: 'https://raw.githubusercontent.com/sergromm/raws/master/empty.json',
	URL: 'http://185.244.172.108:8081',
	getRowsEndpoint: (id: number) => `/v1/outlay-rows/entity/${id}/row/list`,
	createRowEndpoint: (id: number) => `/v1/outlay-rows/entity/${id}/row/create`,
	updateRowEndpoint: (id: number, rowId: number) =>
		`/v1/outlay-rows/entity/${id}/row/${rowId}/update`,
	deleteRowEndpoint: (id: number, rowId: number) =>
		`/v1/outlay-rows/entity/${id}/row/${rowId}/delete`,
	getRows: (setter: (data: RowData[]) => void) =>
		fetch(API.URL + API.getRowsEndpoint(rowEntity.id))
			.then((res) => res.json())
			.then((data) => {
				setter(addLevelsToRows(data));
				return data;
			}),
	fetchRows: (setter: (data: RowData[]) => void) =>
		fetch(API.testJSON)
			.then((res) => res.json())
			.then((data) => {
				setter(data);
				return data;
			}),
};

const addRow = (rows: RowData[], newRow: RowData) => [...rows, newRow];

const removeRecursively = (rows: RowData[], id: number) => {
	return rows.reduce((newRows, row) => {
		if (row.id !== id) {
			const oldRow = { ...row };
			if (oldRow.child) {
				oldRow.child = removeRecursively(oldRow.child, id);
			}
			newRows.push(oldRow);
		}
		return newRows;
	}, [] as RowData[]);
};

const updateChild = (rows: RowData[], id: number, newChild: RowData[]) => {
	return rows.map((row) => {
		if (row.id === id) {
			return {
				...row,
				child: newChild,
			};
		} else {
			if (row.child) {
				updateChild(row.child, id, newChild);
			}
			return row;
		}
	});
};

const updateRowChildren = (rows: RowData[], id: number, newRow: RowData[]) => {
	return rows.map((row) => ({
		...row,
		child: row.id === id ? newRow : row.child,
	}));
};

export const rowsAtom = atom<RowData[]>([]);

export const newRowAtom = atom<RowData>(
	createData(Date.now(), 'Западная строительная площадка', 0, 0, 0, 0, 0),
);

export const addRowAtom = atom(
	() => createData(Date.now(), 'Западная строительная площадка', 0, 0, 0, 0, 0),
	(get, set) => {
		set(rowsAtom, addRow(get(rowsAtom), get(newRowAtom)));
	},
);

const rowsLookup = new Map();
export const createRowsLookup = (rows: RowData[]) => {
	rows.forEach((row) => {
		if (row.id) {
			rowsLookup.set(row.id, row);
		}
		if (row.child) {
			createRowsLookup(row.child);
		}
	});
};

const findParentRow = (rows: RowData[], id: number): RowData | null => {
	for (const row of rows) {
		if (row.id === id) return row;
		if (row.child) {
			const child = findParentRow(row.child, id);
			if (child) return child;
		}
	}
	return null;
};

export const addChildFolderAtom = atom(null, (get, set, parentId: number) => {
	const parent = findParentRow(get(rowsAtom), parentId);
	if (parent) {
		const updatedRows = updateRowChildren(
			get(rowsAtom),
			parentId,
			addRow(
				parent.child,
				createData(
					Date.now(),
					'Западная строительная площадка',
					0,
					0,
					0,
					0,
					parent.level,
				),
			),
		);
		set(rowsAtom, updatedRows);
		console.log('updated:', get(rowsAtom));
	}
});

export const addChildFileAtom = atom(null, (get, set, parentId: number) => {
	const parent = rowsLookup.get(parentId);
	console.log(parent);
	if (parent) {
		const updatedRow = addRow(
			parent.child,
			createData(Date.now(), 'Номенклатура', 0, 0, 0, 0, parent.level),
		);
		const updatedParent = updateChild(get(rowsAtom), parentId, updatedRow);
		console.log(updatedParent);
		console.log(updatedRow);

		set(rowsAtom, updatedParent);
	}
});

export const removeRowAtom = atom(null, (get, set, id: number) => {
	set(rowsAtom, removeRecursively(get(rowsAtom), id));
});
