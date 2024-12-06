import React, { useState } from "react";
import Header from "../components/Header";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";

const HomePage = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");

  const handleScanQRCode = () => {
    alert("QR Code scanning feature is under development.");
  };

  const handleSearchRoute = () => {
    alert("Route search feature is under development.");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="EkiView - Home" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        
        {/* Current Location */}
        <div style={styles.subContent}>
          <div style={styles.descriptionField}>
            <h4>1. Find Current Location</h4>
          </div>
          <small style={styles.hintText}>Type name of facility near your current location</small>
          <InputField
            placeholder="Enter Current Location"
            value={destination}
            onChange={(e) => setCurrentLocation(e.target.value)}
          />
          <small style={styles.hintText}>Or Scan QR Code to find your current location</small>
          <Button text="Scan QR Code" onClick={handleScanQRCode} style={styles.qrButton} />
        </div>

        {/* Destination */}
        <div style={styles.subContent}>
          <div style={styles.descriptionField}>
            <h4>2. Search Destination</h4>
          </div>
          <small style={styles.hintText}>Type text to search your destination</small>
          <InputField
            placeholder="Enter Your Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div style={styles.subContent}>
          <Button text="Search Route" onClick={handleSearchRoute} style={styles.searchButton} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    textAlign: "center",
    marginTop: "60px",
  },
  subContent: {
    marginBottom: "30px",
    margin: "0 auto",
    width: "80%",
    textAlign: "left",
  },
  descriptionField: {
    marginBottom: "-20px",
  },
  qrButton: {
    display: "block",
    margin: "10px auto",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchButton: {
    display: "block",
    margin: "10px auto",
    marginTop: "50px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  hintText: {
    color: "gray",
    fontSize: "12px",
  },
};

export default HomePage;

