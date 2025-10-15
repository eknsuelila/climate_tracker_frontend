import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./map.css";

const Map = () => {
  const events = [
    { id: 1, name: "Wildfire - Kamloops", position: [50.6745, -120.3273], type: "Wildfire" },
    { id: 2, name: "Flood - Abbotsford", position: [49.0504, -122.3045], type: "Flood" },
    { id: 3, name: "Heatwave - Kelowna", position: [49.888, -119.496], type: "Heatwave" },
    { id: 4, name: "Oil Spill - Vancouver", position: [49.2827, -123.1207], type: "Oil Spill" },
  ];

  return (
    <div className="map-page">
      <div className="map-info">
        <h2>Environmental Events Map</h2>
        <p>
          Explore recent environmental events across British Columbia.  
          Click on markers to learn more about the incidents and affected regions.
        </p>
      </div>

      <div className="map-container">
        <MapContainer center={[53.7267, -127.6476]} zoom={6} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {events.map((event) => (
            <Marker key={event.id} position={event.position}>
              <Popup>
                <strong>{event.name}</strong>
                <br />
                Type: {event.type}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
