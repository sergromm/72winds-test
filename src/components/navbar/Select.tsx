import { Box, Button, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Select() {
	return (
		<Box className='select'>
			<Button className='select-button'>
				<Box className='select-title-container'>
					<Typography className='select-title'>Название проекта</Typography>
					<Typography className='select-subtitle'>Аббревиатура</Typography>
				</Box>
				<KeyboardArrowDownIcon />
			</Button>
		</Box>
	);
}
