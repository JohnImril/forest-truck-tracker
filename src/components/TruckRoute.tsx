import React, { useCallback } from "react";
import { CircleMarker, Tooltip, Marker } from "react-leaflet";
import { Hotline, HotlineOptions, Palette } from "react-leaflet-hotline";
import { divIcon } from "leaflet";

interface IProps {
	number: string;
	coords: { coord: [number, number]; speed: number }[];
	color: string;
	lastUpdate: number;
}

const defaultPalette: Palette = [
	{ r: 0, g: 0, b: 255, t: 0 },
	{ r: 0, g: 255, b: 0, t: 0.5 },
	{ r: 255, g: 0, b: 0, t: 1 },
];

const hotlineOptions: HotlineOptions = {
	min: 0,
	max: 100,
	palette: defaultPalette,
	weight: 5,
	outlineWidth: 2,
	outlineColor: "black",
};

const TruckRoute: React.FC<IProps> = React.memo(
	({ number, coords, color, lastUpdate }) => {
		const isConnectionLost = useCallback((lastUpdate: number) => {
			const currentTime = Date.now();
			return currentTime - lastUpdate > 5 * 60 * 1000;
		}, []);

		const getSegments = useCallback(() => {
			if (!isConnectionLost(lastUpdate)) {
				return [coords];
			}

			const segments = [];
			for (let i = 0; i < coords.length - 1; i += 2) {
				segments.push(coords.slice(i, i + 2));
			}
			return segments;
		}, [coords, isConnectionLost, lastUpdate]);

		const createIcon = useCallback(
			(number: string) => {
				return divIcon({
					html: `<div style="background-color: ${color}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">${number}</div>`,
				});
			},
			[color]
		);
		return (
			<>
				{getSegments().map((segment, index) => (
					<Hotline
						key={index}
						data={segment}
						getLat={(c) => c.coord[0]}
						getLng={(c) => c.coord[1]}
						getVal={(c) => c.speed}
						options={hotlineOptions}
					/>
				))}
				{coords.map((c, index) => (
					<CircleMarker
						key={index}
						center={c.coord}
						radius={5}
						color={color}
					>
						<Tooltip>
							<span>
								Truck {number} - Speed: {c.speed} km/h
							</span>
						</Tooltip>
					</CircleMarker>
				))}
				{coords.length > 0 && (
					<Marker
						position={coords[coords.length - 1].coord}
						icon={createIcon(number)}
					>
						<Tooltip>
							<span>
								Truck {number} - Speed:{" "}
								{coords[coords.length - 1].speed} km/h
							</span>
						</Tooltip>
					</Marker>
				)}
			</>
		);
	}
);

export default TruckRoute;
