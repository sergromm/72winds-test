import { atom } from 'jotai';
import { RowData } from './types';

export function createData(
	id: number,
	rowName: string,
	salary: number,
	equipmentCosts: number,
	overheads: number,
	estimatedProfit: number,
) {
	return {
		id,
		rowName,
		salary,
		equipmentCosts,
		overheads,
		estimatedProfit,
		machineOperatorSalary: 0,
		mainCosts: 0,
		materials: 0,
		mimExploitation: 0,
		supportCosts: 0,
		total: 0,
		child: [],
	};
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
				setter(data);
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

const updateRowChildren = (rows: RowData[], id: number, newRow: RowData[]) => {
	return rows.map((row) => ({
		...row,
		child: row.id === id ? newRow : row.child,
	}));
};

export const rowsAtom = atom<RowData[]>([]);

export const newRowAtom = atom<RowData>(
	createData(Date.now(), 'Западная строительная площадка', 0, 0, 0, 0),
);

export const addRowAtom = atom(
	() => createData(Date.now(), 'Западная строительная площадка', 0, 0, 0, 0),
	(get, set) => {
		set(rowsAtom, addRow(get(rowsAtom), get(newRowAtom)));
	},
);

const findParentRow = (rows: RowData[], id: number): RowData | null => {
	console.log('rows:', rows);
	console.log('id:', id);
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
	// console.log(parent);
	if (parent) {
		const updatedRows = updateRowChildren(
			get(rowsAtom),
			parentId,
			addRow(
				parent.child,
				createData(Date.now(), 'Западная строительная площадка', 0, 0, 0, 0),
			),
		);
		set(rowsAtom, updatedRows);
		console.log('updated:', get(rowsAtom));
	}
});

export const addChildFileAtom = atom(null, (get, set, parentId: number) => {
	const parent = findParentRow(get(rowsAtom), parentId);
	if (parent) {
		set(
			rowsAtom,
			updateRowChildren(
				get(rowsAtom),
				parentId,
				addRow(
					parent.child,
					createData(Date.now(), 'Номенклатура', 0, 0, 0, 0),
				),
			),
		);
	}
});

export const removeRowAtom = atom(null, (get, set, id: number) => {
	set(rowsAtom, removeRecursively(get(rowsAtom), id));
});
