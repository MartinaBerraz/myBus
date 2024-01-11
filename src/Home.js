import React from "react";
import MapComponent from "./components/Map";
import { Paper, Typography } from "@mui/material";

export const Home = () => {
  return (
    <>
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          height: "10%",
          padding: "10px",
          backgroundColor: "#3c3c3c",
          zIndex: 1000,
          display: "flex",
          alignItems: "flex-start",
          borderBottom: "4px solid #FFD700",
        }}
      >
        <img
          src="https://buenosaires.gob.ar/assets/img/logos/LogoBA.svg"
          alt="Buenos Aires Logo"
          style={{
            marginRight: "10px",
            width: "50px",
            height: "50px",
            paddingLeft: "5vw",
          }}
        />
      </Paper>
      <MapComponent />
    </>
  );
};
