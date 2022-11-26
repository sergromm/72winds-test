import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

export interface ValueCellProps {
	name: string;
	isEditMode: boolean;
	value: number | string;
	id: number;
	handleDoubleClick?: () => void;
	handleChange?: (e: ChangeEvent) => void;
	handleSubmit?: (e: KeyboardEvent) => void;
}

export interface RowData {
	child: RowData[];
	equipmentCosts: number;
	estimatedProfit: number;
	id: number;
	parentId: null | number;
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

export interface RowPayload {
	id?: number;
	parentId?: null | number;
	rowName: string;
	salary: number;
	equipmentCosts: number;
	overheads: number;
	estimatedProfit: number;
	level: number;
}

export interface RequestRowBody {
	equipmentCosts: number;
	estimatedProfit: number;
	machineOperatorSalary: number;
	mainCosts: number;
	materials: number;
	mimExploitation: number;
	overheads: number;
	rowName: string;
	salary: number;
	supportCosts: number;
}

export interface RowProps extends RowData {
	[key: string]: any;
}

export interface LevelContent<T> {
	[key: number]: T;
}

export interface RowIconProps {
	handleClick: (e: MouseEvent) => void;
	level: number;
	height: number;
	childrenCounter: number;
	icon: JSX.Element;
}

export interface UpdateRowPayload {
	data: RequestRowBody;
	setter: (payload: RowValues) => void;
	id: number;
}

export interface RowPayloadWithId extends RowPayload {
	id: number;
}

export type PickRowValues =
	| 'id'
	| 'rowName'
	| 'salary'
	| 'equipmentCosts'
	| 'overheads'
	| 'estimatedProfit';

export type RowValues = Pick<RowData, PickRowValues>;
