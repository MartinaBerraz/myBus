import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

export const AddressInput = () => {
  const map = useMap();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // Marker personalizado al seleccionar una localización
    const customIcon = new L.Icon({
      iconUrl:
        "https://api.geoapify.com/v1/icon/?type=circle&color=red&icon=thumbtack&iconType=awesome&noShadow&scaleFactor=2&apiKey=69aac14f071e4da6b00b68f6a277f7d4", // Replace with the path to your custom marker icon
      iconSize: [32, 32], // Adjust the size of your custom marker
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const searchControl = new GeoSearchControl({
      provider: provider,
      autoCompleteDelay: 250,
      showMarker: true,
      retainZoomLevel: false,
      marker: {
        icon: customIcon,
      },
      onResult: (result) => {
        const { x, y } = result.geojson.geometry.coordinates;
        const latLng = new L.LatLng(y, x);
        map.setView(latLng, map.getZoom()); // Centra el mapa en la localización seleccionada
      },
    });

    map.addControl(searchControl);

    const searchInput = document.querySelector(
      ".leaflet-geosearch input[type='text']"
    );
    if (searchInput) {
      searchInputRef.current = searchInput;
    }

    return () => {
      map.removeControl(searchControl);
      searchInputRef.current = null;
    };
  }, [map]);

  return <div style={{ marginBottom: 20, marginInline: "2vw" }}></div>;
};
