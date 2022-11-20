import './styles.scss';
import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from '@mui/material';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import Select from './Select';

export interface INavbarProps {}
export function Navbar(props: INavbarProps) {
	return (
		<Drawer className='navbar' variant='permanent'>
			<Toolbar className='toolbar' />
			<Toolbar className='toolbar'>
				<Select />
			</Toolbar>
			<Divider className='divider' />
			<Box component='nav' sx={{ overflow: 'auto' }}>
				<List>
					{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<AutoAwesomeMosaicIcon className='header-button' />
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
}
