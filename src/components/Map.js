import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BusIcon from "@mui/icons-material/DirectionsBus";
import L from "leaflet";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { Markers } from "./Markers";
import { AddressInput } from "./AddressInput";

const apiUrl = "/colectivos/vehiclePositionsSimple";

const clientId = "61faaf493b924b80a8bbec0aa14d41b5";
const clientSecret = "c520741C5966480BB7F3cdB89e9895fe";

const Map = () => {
  const [busLines, setBusLines] = useState([]);
  const [selectedBusLines, setSelectedBusLines] = useState([]);

  const handleBusLinesChange = (lines) => {
    setBusLines(lines);
  };

  const handleSelectedBusLinesChange = (event, values) => {
    setSelectedBusLines(values);
  };

  return (
    <>
      <Paper
        elevation={12}
        sx={{
          width: 300,
          marginTop: "50px",
          position: "absolute",
          right: 10,
          top: 30,
          zIndex: 1000,
          borderRadius: "10px",
          backgroundColor: "#3c3c3c",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={busLines}
          value={selectedBusLines}
          onChange={handleSelectedBusLinesChange}
          isMulti
          style={{ color: "white" }}
          sx={{
            marginInline: "3vw",
            marginBlock: "3vh",
            borderColor: "white",
            border: 0,
            ".MuiOutlinedInput-notchedOutline": {
              border: 0,
              borderBlock: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: 0,
              borderRadius: 0,
              borderBlock: "none",
              color: "white",
            },
            alignContent: "center",
            alignItems: "center",
            borderRadius: 0,
            borderBlock: "none",
            // borderBottom: "2px solid #FFD700",
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Línea"
              sx={{
                color: "white",
                "& input": {
                  borderBottom: "2px solid  #FFD700",
                  color: "white",
                },
                "& label": {
                  color: "white",
                },
              }}
            />
          )}
        />
      </Paper>
      <MapContainer
        center={[-34.61, -58.38]} // coordenadas de Buenos Aires
        zoom={12}
        style={{ height: "800px", width: "100%", position: "relative" }}
      >
        <AddressInput />

        <Markers
          onBusLinesChange={handleBusLinesChange}
          selectedBusLines={selectedBusLines}
        />
      </MapContainer>
    </>
  );
};

export default Map;
