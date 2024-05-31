// Mantine components
import { Grid } from '@mantine/core';

// View components
import CropYieldTable from './components/CropYieldTable';
import YearlyCropYieldTable from './components/YearlyCropYieldTable';

// Custom hooks
import useFetch from './hooks/useFetch';

// Utility functions
import { aggregateCropData } from './utils/cropDataAggregator';

// Styles
import './App.css';

function App() {
	const { data: cropRawData } = useFetch('manufac _ india_agro_dataset.json');

	const { yearlyProductionCropData, cropWiseYield } =
		aggregateCropData(cropRawData);

	return (
		<Grid className='full-height-grid'>
			<Grid.Col span={12} className='half-height-col'>
				<YearlyCropYieldTable data={yearlyProductionCropData} />
			</Grid.Col>

			<Grid.Col span={12} className='half-height-col'>
				<CropYieldTable data={cropWiseYield} />
			</Grid.Col>
		</Grid>
	);
}

export default App;
