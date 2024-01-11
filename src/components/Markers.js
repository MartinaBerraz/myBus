import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BusIcon from "@mui/icons-material/DirectionsBus";
import L from "leaflet";
import { Autocomplete, TextField } from "@mui/material";
import { AddressInput } from "./AddressInput";

const apiUrl = "/colectivos/vehiclePositionsSimple";
const geocodingApiUrl = "https://nominatim.openstreetmap.org/search";

const clientId = "61faaf493b924b80a8bbec0aa14d41b5";
const clientSecret = "c520741C5966480BB7F3cdB89e9895fe";

const defaultIcon = new L.Icon({
  iconUrl:
    "https://api.geoapify.com/v1/icon/?type=material&color=%23ffd700&icon=bus&iconType=awesome&scaleFactor=2&apiKey=69aac14f071e4da6b00b68f6a277f7d4",

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

  console.log("Selected Bus Lines:", selectedBusLines);

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
            {console.log(bus)}

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
