import './styles/styles.scss';
import { Box, Grid, Toolbar } from '@mui/material';
import ProjectView from './components/project-view';
import Header from './components/header';
import Navbar from './components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Grid container>
				<Grid item>
					<Header />
				</Grid>
				<Grid item>
					<Box component='main' className='main-view'>
						<Navbar />
						<ProjectView />
					</Box>
				</Grid>
			</Grid>
		</QueryClientProvider>
	);
}
