import { RowIconProps } from '../../types';

export default function RowIcon(props: RowIconProps) {
	const { handleClick, level, height, childrenCounter, icon } = props;
	return (
		<button
			onClick={handleClick}
			className={`button main-button level-${level} ${
				level > 0 ? 'child' : ''
			}`}>
			{icon}
			<div
				style={{
					width: '1px',
					height: height + 'px',
					borderLeft: 'thin solid #c6c6c6',
					transform: 'translateY(100%)',
					position: 'absolute',
					bottom: '5px',
					display: `${childrenCounter === 0 ? 'none' : 'block'}`,
				}}
			/>
		</button>
	);
}
