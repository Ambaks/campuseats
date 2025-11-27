"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent({ meals }) {
    return (
        <MapContainer center={[37.7749, -122.4194]} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {meals.map((meal) => (
                <Marker key={meal.id} position={meal.location}>
                    <Popup>{meal.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
