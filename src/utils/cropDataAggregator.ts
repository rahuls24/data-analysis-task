// Types
import {
	CropAggregatedData,
	CropData,
	YearlyCropProduction,
} from '../types/CropDataTypes';

// constants
export const START_YEAR = 1950;
export const END_YEAR = 2020;
const YEAR_RANGE = END_YEAR - START_YEAR + 1;

// Function to aggregate crop data into yearly production data and crop-wise yield data
export function aggregateCropData(rawCropData: any): {
	yearlyProductionCropData: YearlyCropProduction[];
	cropWiseYield: CropAggregatedData[];
} {
	const transformCropData = getTransformCropData(rawCropData);

	const yearlyProductionCropData =
		aggregateYearlyProductionCropData(transformCropData);

	const cropWiseYield = aggregateCropWiseYield(transformCropData);

	return { yearlyProductionCropData, cropWiseYield };
}

// Function to aggregate yearly crop production data
export function aggregateYearlyProductionCropData(
	cropData: CropData[],
): YearlyCropProduction[] {
	// Reduce crop data into an object keyed by year
	const yearlyProductionCropData = cropData.reduce((acc, curr) => {
		if (curr.year in acc) {
			acc[curr.year].push(curr);
		} else {
			acc[curr.year] = [curr];
		}
		return acc;
	}, {} as { [key: number]: CropData[] });

	// Transform the object into an array of YearlyCropProduction objects
	return Object.keys(yearlyProductionCropData).map(key => {
		const { cropWithMinProduction, cropWithMaxProduction } =
			findMinMaxProductionCrop(yearlyProductionCropData[Number(key)]);
		return {
			year: Number(key),
			cropWithMinProduction,
			cropWithMaxProduction,
		};
	});

	// Helper function to find crops with the minimum and maximum production
	function findMinMaxProductionCrop(cropData: CropData[]): {
		cropWithMaxProduction: string;
		cropWithMinProduction: string;
	} {
		if (cropData.length === 0) {
			return { cropWithMaxProduction: '', cropWithMinProduction: '' };
		}
		let cropWithMaxProduction: string = '';
		let cropWithMinProduction: string = '';
		let maxProduction = Number.MIN_SAFE_INTEGER;
		let minProduction = Number.MAX_SAFE_INTEGER;
		cropData.forEach(crop => {
			if (crop.production > maxProduction) {
				maxProduction = crop.production;
				cropWithMaxProduction = crop.name;
			}
			if (crop.production < minProduction) {
				minProduction = crop.production;
				cropWithMinProduction = crop.name;
			}
		});

		return { cropWithMaxProduction, cropWithMinProduction };
	}
}

// Function to aggregate crop-wise yield data
function aggregateCropWiseYield(cropData: CropData[]): CropAggregatedData[] {
	// Reduce crop data into an object keyed by crop name
	const cropWiseYield = cropData.reduce((acc, curr) => {
		if (curr.name in acc) {
			acc[curr.name].push(curr);
		} else {
			acc[curr.name] = [curr];
		}
		return acc;
	}, {} as { [key: string]: CropData[] });

	// Transform the object into an array of CropAggregatedData objects
	return Object.keys(cropWiseYield).map(key => {
		const cropData = cropWiseYield[key];
		const averageYield = (
			cropData.reduce((acc, curr) => acc + curr.totalYield, 0) /
			YEAR_RANGE
		).toFixed(3);
		const averageCultivationArea = (
			cropData.reduce((acc, curr) => acc + curr.area, 0) / YEAR_RANGE
		).toFixed(3);
		return {
			name: key,
			averageYield,
			averageCultivationArea,
		};
	});
}

// Function to transform raw crop data into structured CropData objects
function getTransformCropData(rawData: any): CropData[] {
	if (Array.isArray(rawData)) {
		// Map each raw data entry to a CropData object
		return rawData.map(crop => ({
			year: getYear(crop.Year),
			name: String(crop['Crop Name']),
			totalYield: getTotalYield(
				crop['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))'],
				crop['Area Under Cultivation (UOM:Ha(Hectares))'],
			),
			production: Number(crop['Crop Production (UOM:t(Tonnes))']),
			area: Number(crop['Area Under Cultivation (UOM:Ha(Hectares))']),
		}));
	}
	// Return an empty array if the raw data is not an array
	return [];

	// Helper function to extract the year from a raw year string
	function getYear(rawYear: string) {
		const parts = rawYear.split(',');
		if (parts.length > 1) {
			const lastPart = parts[parts.length - 1]?.trim();
			const year = Number(lastPart);
			return isNaN(year) ? 0 : year;
		}

		return 0;
	}

	// Helper function to calculate the total yield
	function getTotalYield(
		yieldOfCrops: string | number,
		areaUnderCultivation: string | number,
	): number {
		if (
			typeof yieldOfCrops === 'string' ||
			typeof areaUnderCultivation === 'string'
		)
			return 0;
		return yieldOfCrops * areaUnderCultivation;
	}
}
