import { ChangeEvent, KeyboardEvent } from 'react';

export interface ValueCellProps {
	value: number | string;
	isEditMode: boolean;
	name: string;
	handleChange: (e: ChangeEvent) => void;
	handleSubmit: (e: KeyboardEvent) => void;
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
