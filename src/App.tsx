import './styles/styles.scss';
import { Box, Grid, Toolbar } from '@mui/material';
import ProjectView from './components/project-view';
import Header from './components/header';
import Navbar from './components/navbar';

export default function App() {
	return (
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
	);
}
