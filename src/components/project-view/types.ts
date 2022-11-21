export interface RowValues {
	id: number;
	name: string;
	basicSalary: number;
	equipment: number;
	overheads: number;
	income: number;
}

export interface ValueCellProps {
	isEditMode: boolean;
	value: number | string;
}

export interface RowProps {
	row: RowValues;
}

export interface RowData {
	child: RowData[] | null[];
	equipmentCosts: number;
	estimatedProfit: number;
	id: number;
	machineOperatorSalary: number;
	mainCosts: number;
	materials: number;
	mimExploitation: number;
	overheads: number;
	rowName: string;
	salary: number;
	supportCosts: number;
	total: number;
}

export interface TableStore {
	rows: RowValues[];
	newRow: RowValues;
	add: (data: RowValues) => void;
	remove: (id: number) => void;
}
