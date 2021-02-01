import { FeatureCollection, Polygon, Point, LineString, GeoJsonProperties } from 'geojson';

/** Represents a rew map stack json file */
export interface MapStack {
	languageVersion: string;
	name: string;
	buildNumber: number;
	resolution: number;
	origin: number[];
	metadata: object;
	logical: FeatureCollection<Polygon, GeoJsonProperties>;
	workflowPoints: FeatureCollection<Point, GeoJsonProperties>;
	aisles: FeatureCollection<LineString, GeoJsonProperties>;
	connectivity: {
		matrix: {
			start: string;
			end: string;
			cost: number;
		}[];
	};
}
