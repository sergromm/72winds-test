import { RowData } from '../types';

export function countChildren(children: RowData[], counter = 0): number {
	if (children.length === 0) return counter;

	for (let i = 0; i < children.length - 1; i += 1) {
		counter += 1;
		if (children[i].child) {
			counter = countChildren(children[i].child, counter);
		}
	}

	return (counter += 1);
}

const firstLineLength = 53;
const restLinesLength = 60;

export function levelLineLength(counter: number) {
	return firstLineLength + restLinesLength * (counter - 1);
}
