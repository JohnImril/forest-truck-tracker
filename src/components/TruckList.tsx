import React from "react";

interface IProps {
	trucks: string[];
	visibleTrucks: string[];
	toggleTruckVisibility: (number: string) => void;
	toggleAllVisibility: (visible: boolean) => void;
}

const TruckList: React.FC<IProps> = React.memo(
	({ trucks, visibleTrucks, toggleTruckVisibility, toggleAllVisibility }) => {
		const allVisible = trucks.length === visibleTrucks.length;

		return (
			<div
				style={{
					width: "300px",
					padding: "10px",
					backgroundColor: "#f0f0f0",
				}}
			>
				<h2>Truck Routes</h2>
				<div>
					<label>
						<input
							type="checkbox"
							checked={allVisible}
							onChange={() => toggleAllVisibility(!allVisible)}
						/>
						Toggle All
					</label>
				</div>
				<ul>
					{trucks.map((number) => (
						<li key={number}>
							<label>
								<input
									type="checkbox"
									checked={visibleTrucks.includes(number)}
									onChange={() =>
										toggleTruckVisibility(number)
									}
								/>
								Truck {number}
							</label>
						</li>
					))}
				</ul>
			</div>
		);
	}
);

export default TruckList;
