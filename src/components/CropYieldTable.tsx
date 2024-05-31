// Mantine components
import { Table, Text } from '@mantine/core';

// Types
import { CropAggregatedData } from '../types/CropDataTypes';

// Constants
import { END_YEAR, START_YEAR } from '../utils/cropDataAggregator';

type CropYieldTableProps = {
	data: CropAggregatedData[];
};
function CropYieldTable(props: CropYieldTableProps) {
	const { data } = props;

	const rows = data.map(row => (
		<Table.Tr key={row.name}>
			<Table.Td>{row.name}</Table.Td>
			<Table.Td>{row.averageYield}</Table.Td>
			<Table.Td>{row.averageCultivationArea}</Table.Td>
		</Table.Tr>
	));

	return (
		<div className='p-4'>
			<Text fw={700} className='center-title pb-4'>
				{'Crop-wise Yield Analysis'}
			</Text>
			<div></div>
			<Table
				striped
				highlightOnHover
				withTableBorder
				withColumnBorders
				stickyHeader
				className='half-height-col'
			>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>{'Crop'}</Table.Th>
						<Table.Th>
							{`Average Yield of the Crop between ${START_YEAR}-${END_YEAR}`}
						</Table.Th>
						<Table.Th>
							{`Average Cultivation Area of the Crop between ${START_YEAR}-${END_YEAR}`}
						</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</div>
	);
}

export default CropYieldTable;
