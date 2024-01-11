import React, { useEffect, useState } from "react";
import { Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const apiUrl = "/colectivos/vehiclePositionsSimple";
const geocodingApiUrl = "https://nominatim.openstreetmap.org/search";

const clientId = process.env.REACT_APP_API_CLIENT_ID;
const clientSecret = process.env.REACT_APP_API_CLIENT_SECRET;

const iconsApiKey = process.env.REACT_APP_ICONS_API_KEY;

const defaultIcon = new L.Icon({
  iconUrl: `https://api.geoapify.com/v1/icon/?type=material&color=%23ffd700&icon=bus&iconType=awesome&scaleFactor=2&apiKey=${iconsApiKey}`,

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const Markers = ({ onBusLinesChange, selectedBusLines }) => {
  const map = useMap();
  const [busData, setBusData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}?client_id=${clientId}&client_secret=${clientSecret}`
        );

        if (!response.ok) {
          throw new Error("Error fetching bus data");
        }

        const data = await response.json();
        setBusData(data);
        updateBusLines(data);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const isMarkerVisible = (marker) => {
    const bounds = map.getBounds();
    const markerLatLng = L.latLng(marker.latitude, marker.longitude);
    return bounds.contains(markerLatLng);
  };

  const visibleMarkers = busData.filter(
    (bus) =>
      isMarkerVisible(bus) &&
      (!selectedBusLines ||
        !selectedBusLines.length ||
        selectedBusLines.includes(bus.route_short_name))
  );

  const updateBusLines = (data) => {
    const uniqueBusLines = Array.from(
      new Set(data.map((bus) => bus.route_short_name))
    );
    onBusLinesChange(uniqueBusLines);
  };
  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {visibleMarkers &&
        visibleMarkers.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.latitude, bus.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              Línea: {bus.route_short_name}, Actualizado:{" "}
              {new Date().toLocaleTimeString()},
              <br /> {bus.trip_headsign}
            </Popup>
          </Marker>
        ))}
    </>
  );
};
