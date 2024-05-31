export type YearlyCropProduction = {
	year: number;
	cropWithMaxProduction: string;
	cropWithMinProduction: string;
};

export type CropAggregatedData = {
	name: string;
	averageYield: string;
	averageCultivationArea: string;
};

export type CropData = {
	name: string;
	year: number;
	totalYield: number;
	production: number;
	area: number;
};
