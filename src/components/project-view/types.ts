export interface ValueCellProps {
	isEditMode: boolean;
	value: number | string;
}

export interface RowData {
	child: RowData[];
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
	level: number;
}
