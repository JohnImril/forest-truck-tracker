# Truck Routes Visualization

This project visualizes the routes of multiple trucks in real-time using a map. Each truck has a tracker that records its speed and coordinates, and this data is displayed on the map. The color of the routes changes based on the speed of the trucks, and users can toggle the visibility of individual truck routes or all routes at once.

## Features

1. **Real-Time Route Display**: Display the routes of trucks on a map in real-time.
2. **Speed-Based Route Color**: The color of the routes changes based on the speed of the trucks:
    - Slow speed: Blue
    - Medium speed: Green
    - High speed: Red
3. **Connection Loss Handling**: If a truck tracker does not send data for more than 5 minutes, the route is displayed as a dashed line from the point of signal loss to the point of signal recovery.
4. **Point Display**: Display points (circles) on the map for each recorded location of the truck. Clicking on a point displays the truck number and speed at that location.
5. **Layer Control**:
    - Toggle visibility of all truck routes.
    - Toggle visibility of individual truck routes.
    - Display the truck number at the last point of the route.

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/JohnImril/forest-truck-tracker.git
    cd forest-truck-tracker
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1. Start the backend server:

    ```bash
    node server.js
    ```

2. Start the frontend application:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

3. Open your browser and navigate to `http://localhost:5173`.

### Backend Server

The backend server generates random truck data for visualization. The data is sent every second in the following format:

```json
{
	"data": [
		{ "number": "1", "speed": 57.0, "coord": [50.0, 50.0] },
		{ "number": "2", "speed": 64.0, "coord": [49.0, 50.0] }
	]
}
```

### Frontend

The frontend is built with React and uses the following libraries:

-   `react-leaflet` for map integration
-   `react-leaflet-hotline` for rendering the routes with color gradients based on speed
