import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSearch from "../hook/useSearch";
import Header from "../components/Header";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";

const HomePage = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [originPanorama, setOriginPanorama] = useState("");
  const { results, error, search } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentLocation && destination) {
      search(currentLocation, destination);
    }
  }, [currentLocation, destination]);

  useEffect(() => {
    if (error) {
      alert("Failed to search route. Please try again.");
    } else if (results.length !== 0) {
      navigate('/route', {
        state: {
          results,
          originPanorama,
        },
      });
    }
  }, [results, error]);

  const handleScanQRCode = () => {
    alert("QR Code scanning feature is under development.");
  };

  const handleSearchRoute = () => {
    //クエリパラメータから値を取得
    const queryParams = new URLSearchParams(location.search);
    const originPlaceId = queryParams.get("origin_place_id");
    const destinationPlaceId = queryParams.get("destination_place_id");
    const originPanoramaId = queryParams.get("origin_panorama_id");

    if (!originPlaceId || !destinationPlaceId || !originPanoramaId) {
      alert("Please enter your current location and destination.");
      return;
    };
    setCurrentLocation(originPlaceId);
    setDestination(destinationPlaceId);
    setOriginPanorama(originPanoramaId);
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
