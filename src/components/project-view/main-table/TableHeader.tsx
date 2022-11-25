import { TableCell, TableHead, TableRow } from '@mui/material';

const titles = [
	'Уровень',
	'Наименование',
	'Основная з/п',
	'Оборудование',
	'Накладные расходы',
	'Сметная прибыль',
];

export default function TableHeader() {
	return (
		<TableHead>
			<TableRow className='table-header'>
				{titles.map((title) => (
					<TableCell key={title} className='table-cell'>
						{title}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
