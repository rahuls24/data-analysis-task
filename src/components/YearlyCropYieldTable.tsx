// Mantine components
import { Table, Text } from '@mantine/core';
// Types
import { YearlyCropProduction } from '../types/CropDataTypes';

type YearlyCropYieldTableProps = {
	data: YearlyCropProduction[];
};
function YearlyCropYieldTable(props: YearlyCropYieldTableProps) {
	const { data } = props;

	const rows = data.map(row => (
		<Table.Tr key={row.year}>
			<Table.Td>{row.year}</Table.Td>
			<Table.Td>{row.cropWithMaxProduction}</Table.Td>
			<Table.Td>{row.cropWithMinProduction}</Table.Td>
		</Table.Tr>
	));

	return (
		<div className='p-4'>
			<Text fw={700} className='center-title pb-4'>
				{'Yearly Crop Yield Analysis'}
			</Text>
			<Table
				striped
				highlightOnHover
				withTableBorder
				withColumnBorders
				stickyHeader
			>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>{'Year'}</Table.Th>
						<Table.Th>
							{'Crop with MaximumProduction in that Year'}
						</Table.Th>
						<Table.Th>
							{'Crop with Minimum Production in that Year'}
						</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</div>
	);
}

export default YearlyCropYieldTable;
