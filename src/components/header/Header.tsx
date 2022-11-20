import './styles.scss';
import { useState } from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import AppsIcon from '@mui/icons-material/Apps';

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box component='header' className='header'>
			<Button className='header-button'>
				<AppsIcon />
			</Button>
			<Button className='header-button'>
				<ReplyIcon />
			</Button>
			<Tabs className='tabs' value={value} onChange={handleChange}>
				<Tab className='tab' label='Просмотр' />
				<Tab className='tab' label='Управление' />
			</Tabs>
		</Box>
	);
}
