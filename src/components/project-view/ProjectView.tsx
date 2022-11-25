import './styles.scss';
import { Box, Divider, Toolbar, Typography } from '@mui/material';
import MainTable from './main-table';

export interface IMainTableProps {}

export function ProjectView(props: IMainTableProps) {
	return (
		<Box component='section' className='table-view'>
			<Toolbar className='toolbar' />
			<Box className='title-container'>
				<Typography className='project-view-title'>
					Строительно-монтажные работы
				</Typography>
				<Divider className='divider' orientation='vertical' flexItem />
			</Box>
			<MainTable />
		</Box>
	);
}
