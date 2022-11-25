import '../styles.scss';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { API, rowsAtom, newRowAtom, createRowsLookup } from '../services';
import { Table, TableBody, Box, CircularProgress } from '@mui/material';
import TableHeader from './TableHeader';
import Row from './row';

export default function MainTable() {
	const [rows, rowsSet] = useAtom(rowsAtom);
	const [newRow] = useAtom(newRowAtom);
	const query = useQuery({
		queryKey: ['rows'],
		queryFn: () => API.getRows(rowsSet),
	});

	createRowsLookup(rows);

	return (
		<Box className='table-container'>
			{query.isLoading ? (
				<CircularProgress />
			) : (
				<Table aria-label='simple table'>
					<TableHeader />
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row) => <Row key={row.id} {...row} />)
						) : (
							<Row {...newRow} />
						)}
					</TableBody>
				</Table>
			)}
			<ReactQueryDevtools />
		</Box>
	);
}
