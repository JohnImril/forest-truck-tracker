import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TruckRoute from "./TruckRoute";
import TruckList from "./TruckList";

interface TruckData {
	number: string;
	speed: number;
	coord: [number, number];
}

interface Truck {
	number: string;
	coords: { coord: [number, number]; speed: number }[];
	lastUpdate: number;
}

const Map: React.FC = () => {
	const [truckData, setTruckData] = useState<Truck[]>([]);
	const [visibleTrucks, setVisibleTrucks] = useState<string[]>([]);
	const [allTruckNumbers, setAllTruckNumbers] = useState<string[]>([]);
	const [initialized, setInitialized] = useState(false);

	const speedLimits = useMemo(() => ({ low: 30, medium: 60 }), []);

	const fetchData = useCallback(() => {
		fetch("http://localhost:3001/api/truck-data") // replace with your api
			.then((response) => response.json())
			.then((data) => {
				const currentTime = Date.now();
				setTruckData((prevTruckData) => {
					const updatedTruckData = prevTruckData.map((truck) => ({
						...truck,
						coords: [...truck.coords],
					}));

					data.data.forEach((truck: TruckData) => {
						const existingTruck = updatedTruckData.find(
							(t) => t.number === truck.number
						);
						if (existingTruck) {
							existingTruck.coords.push({
								coord: truck.coord,
								speed: truck.speed,
							});
							existingTruck.lastUpdate = currentTime;
						} else {
							updatedTruckData.push({
								number: truck.number,
								coords: [
									{ coord: truck.coord, speed: truck.speed },
								],
								lastUpdate: currentTime,
							});
						}
					});

					setAllTruckNumbers(
						updatedTruckData.map((truck) => truck.number)
					);

					return updatedTruckData;
				});
			})
			.catch((error) =>
				console.error("Error fetching truck data:", error)
			);
	}, []);

	useEffect(() => {
		const interval = setInterval(fetchData, 1000);
		return () => clearInterval(interval);
	}, [fetchData]);

	useEffect(() => {
		if (!initialized && allTruckNumbers.length > 0) {
			setVisibleTrucks(allTruckNumbers);
			setInitialized(true);
		}
	}, [allTruckNumbers, initialized]);

	const getColor = useCallback(
		(speed: number) => {
			if (speed <= speedLimits.low) return "blue";
			if (speed <= speedLimits.medium) return "green";
			return "red";
		},
		[speedLimits]
	);

	const toggleTruckVisibility = (number: string) => {
		setVisibleTrucks((prevVisibleTrucks) =>
			prevVisibleTrucks.includes(number)
				? prevVisibleTrucks.filter((n) => n !== number)
				: [...prevVisibleTrucks, number]
		);
	};

	const toggleAllVisibility = (visible: boolean) => {
		setVisibleTrucks(visible ? allTruckNumbers : []);
	};

	return (
		<div style={{ display: "flex" }}>
			<TruckList
				trucks={truckData.map((truck) => truck.number)}
				visibleTrucks={visibleTrucks}
				toggleTruckVisibility={toggleTruckVisibility}
				toggleAllVisibility={toggleAllVisibility}
			/>
			<div style={{ flexGrow: 1 }}>
				<MapContainer
					center={[60.0, 60.0]}
					zoom={5}
					style={{ height: "100vh", width: "100%" }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{truckData.map((truck) =>
						visibleTrucks.includes(truck.number) ? (
							<FeatureGroup key={truck.number}>
								<TruckRoute
									number={truck.number}
									coords={truck.coords}
									color={getColor(
										truck.coords[truck.coords.length - 1]
											.speed
									)}
									lastUpdate={truck.lastUpdate}
								/>
							</FeatureGroup>
						) : null
					)}
				</MapContainer>
			</div>
		</div>
	);
};

export default Map;
