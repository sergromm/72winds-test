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

const navbarItem = [
	'По проекту',
	'Объекты',
	'РД',
	'МТО',
	'СМР',
	'График',
	'МиМ',
	'Рабочие',
	'Капвложения',
	'Бюджет',
	'Финансирование',
	'Панорамы',
	'Камеры',
	'Поручения',
	'Контрагенты',
];

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
					{navbarItem.map((text, index) => (
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
