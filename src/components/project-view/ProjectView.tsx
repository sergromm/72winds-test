import './styles.scss';
import { Box, Divider, Toolbar, Typography } from '@mui/material';
import MainTabel from './MainTabel';

export interface IMainTableProps {}

export function ProjectView(props: IMainTableProps) {
	return (
		<Box component='section' className='table-view'>
			<Toolbar className='toolbar' />
			<Box
				sx={{
					display: 'flex',
					minHeight: '45px',
					alignItems: 'center',
					backgroundColor: '#27272a',
				}}>
				<Typography className='project-view-title'>
					Строительно-монтажные работы
				</Typography>
				<Divider className='divider' orientation='vertical' flexItem />
			</Box>
			<Divider className='divider' />
			<MainTabel />
		</Box>
	);
}
