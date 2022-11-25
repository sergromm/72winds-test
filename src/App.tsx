import './styles/styles.scss';
import { Box, Grid, Toolbar } from '@mui/material';
import ProjectView from './components/project-view';
import Header from './components/header';
import Navbar from './components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<JotaiProvider>
				<Grid container>
					<Grid item>
						<Header />
					</Grid>
					<Grid className='page-container' item>
						<Box component='main' className='main-view'>
							<Navbar />
							<ProjectView />
						</Box>
					</Grid>
				</Grid>
			</JotaiProvider>
		</QueryClientProvider>
	);
}
