import { atom } from 'jotai';
import {
	RequestRowBody,
	RowData,
	RowPayload,
	RowValues,
	UpdateRowPayload,
} from './types';

export function createData({
	id = Date.now(),
	parentId = null,
	rowName,
	salary,
	equipmentCosts,
	overheads,
	estimatedProfit,
	level,
}: RowPayload) {
	return {
		id,
		parentId,
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

function addLevelsToRows(rows: RowData[], level = 0): RowData[] {
	return rows.map((row) => ({
		...row,
		level,
		child: row.child ? addLevelsToRows(row.child, level + 1) : [],
	}));
}

const rowEntity = {
	id: 29955,
	rowName: '47d90b1b-f4ba-452f-8f4e-d2785fe613ff',
};

export const URL = 'http://185.244.172.108:8081';
const getRowsEndpoint = `/v1/outlay-rows/entity/${rowEntity.id}/row/list`;
const createRowEndpoint = `/v1/outlay-rows/entity/${rowEntity.id}/row/create`;

const updateRowEndpoint = (rowId: number) =>
	`/v1/outlay-rows/entity/${rowEntity.id}/row/${rowId}/update`;
export const deleteRowEndpoint = (rowId: number) =>
	`/v1/outlay-rows/entity/${rowEntity.id}/row/${rowId}/delete`;

const empty =
	'https://raw.githubusercontent.com/sergromm/raws/master/empty.json';
const testJSON =
	'https://raw.githubusercontent.com/sergromm/raws/master/index.json';

interface CreateRequesRowBody extends RequestRowBody {
	parentId: null | number;
}

export const API = {
	getRows: (setter: (data: RowData[]) => void) =>
		fetch(URL + getRowsEndpoint)
			.then((res) => res.json())
			.then((data) => {
				setter(addLevelsToRows(data));
				return data;
			}),

	createRow: (data: CreateRequesRowBody) =>
		fetch(URL + createRowEndpoint, {
			body: JSON.stringify(data),
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch(console.log),

	updateRow: ({ data, id, setter }: UpdateRowPayload) => {
		fetch(URL + updateRowEndpoint(id), {
			body: JSON.stringify(data),
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setter(data.current);
				data.changed.forEach(setter);
			})
			.catch(console.log);
	},

	deleteRow: (rowId: number) => {
		fetch(URL + deleteRowEndpoint(rowId), {
			method: 'delete',
		})
			.then((res) => res.json())
			.catch(console.log);
	},

	fetchRows: (setter: (data: RowData[]) => void) =>
		fetch(testJSON)
			.then((res) => res.json())
			.then((data) => setter(addLevelsToRows(data)))
			.catch(console.log),
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

const updateRowChildren = (
	rows: RowData[],
	id: number,
	newChild: RowData[],
) => {
	let newRows = [];

	for (const row of rows) {
		if (row.id !== id) {
			newRows.push(row);
		} else if (row.id === id) {
			newRows.push({ ...row, child: newChild });
		}

		if (row.child) {
			row.child = updateRowChildren(row.child, id, newChild);
		}
	}

	return newRows;
};

export const rowsAtom = atom<RowData[]>([]);

export const newRowAtom = atom<RowData>(
	createData({
		id: Date.now(),
		rowName: '',
		equipmentCosts: 0,
		estimatedProfit: 0,
		overheads: 0,
		salary: 0,
		level: 0,
	}),
);

export const addRowAtom = atom(null, (get, set, payload: RowPayload) => {
	const newRow = addRow(get(rowsAtom), createData(payload));

	set(rowsAtom, newRow);
});

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
	console.log(parent, parentId);
	if (parent) {
		const updatedChild = addRow(
			parent.child,
			createData({
				id: Date.now(),
				parentId: parent.id,
				rowName: 'Западная строительная площадка',
				equipmentCosts: 0,
				estimatedProfit: 0,
				overheads: 0,
				salary: 0,
				level: parent.level + 1,
			}),
		);

		const updatedRows = updateRowChildren(
			get(rowsAtom),
			parentId,
			updatedChild,
		);

		set(rowsAtom, updatedRows);
	}
});

export const addChildFileAtom = atom(null, (get, set, id: number) => {
	const row = findParentRow(get(rowsAtom), id);
	console.log(row);
	if (row) {
		const updatedChild = addRow(
			row.child,
			createData({
				id: Date.now(),
				parentId: row.id,
				rowName: 'Номенклатура',
				equipmentCosts: 0,
				estimatedProfit: 0,
				overheads: 0,
				salary: 0,
				level: 2,
			}),
		);
		const updatedRow = updateRowChildren(get(rowsAtom), id, updatedChild);
		set(rowsAtom, updatedRow);
	}
});

const updateRowValues = (rows: RowData[], id: number, newValues: RowValues) => {
	return rows.map((row) => {
		if (row.id === id) {
			return {
				...row,
				...newValues,
			};
		}

		if (row.child) {
			row.child = updateRowValues(row.child, id, newValues);
		}

		return row;
	});
};

export const updateRowAtom = atom(null, (get, set, payload: RowValues) => {
	console.log(payload);
	const updatedRow = updateRowValues(get(rowsAtom), payload.id, payload);
	set(rowsAtom, updatedRow);
});

export const removeRowAtom = atom(null, (get, set, id: number) => {
	set(rowsAtom, removeRecursively(get(rowsAtom), id));
});
