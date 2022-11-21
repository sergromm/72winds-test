import { TableRow } from '@mui/material';
import { proxy } from 'valtio';
import { RowValues, TableStore } from './types';

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

const addRow = (rows: RowValues[], newRow: RowValues) => [...rows, newRow];
let id = 0;
export const store = proxy<TableStore>({
	rows: [createData(id, 'Южная строительная площадка', 0, 0, 0, 0)],
	newRow: createData(id++, '', 0, 0, 0, 0),
	add(data) {
		store.rows = addRow(store.rows, data);
		store.newRow = createData(id++, '', 0, 0, 0, 0);
	},
	remove(id) {
		store.rows = store.rows.filter((row: RowValues) => row.id !== id);
	},
});
