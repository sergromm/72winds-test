import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

export default function FileSystemNavigator() {
	return (
		<TreeView
			aria-label='project structure'
			sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
			<TreeItem nodeId='1' label='Applications'>
				<TreeItem nodeId='2' label='Calendar' />
			</TreeItem>
		</TreeView>
	);
}
