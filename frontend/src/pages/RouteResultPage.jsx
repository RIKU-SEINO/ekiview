import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import StreetViewPartial from "../partials/StreetViewPartial";
import RouteInformationPartial from "../partials/RouteInformationPartial";

const RouteResultPage = () => {
  const { t } = useTranslation();  
  const location = useLocation();
  const { results, originPanorama } = location.state;
  const [activeView, setActiveView] = useState("streetView");

  const switchToStreetView = () => {
    setActiveView("streetView");
  };
  const switchToRouteInformation = () => {
    setActiveView("routeInformation");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="EkiView - Route Result" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.btnContainerFlex}>
          <Button
            text={t('Street View')}
            onClick={switchToStreetView}
            style={{
              ...styles.button,
              borderColor: activeView === "streetView" ? "black" : "white",
              outline: activeView === "streetView" ? "1.5px solid black" : "0.2px solid gray",
            }}
          />
          <Button
            text={t('Route Information')}
            onClick={switchToRouteInformation}
            style={{
              ...styles.button,
              borderColor: activeView === "routeInformation" ? "black" : "white",
              outline: activeView === "routeInformation" ? "1.5px solid black" : "0.2px solid gray",
            }}
          />
        </div>
        { activeView === "streetView" ? (
          <StreetViewPartial results={results} originPanorama={originPanorama} />
        ) : (
          <RouteInformationPartial results={results} />
        )}
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
  btnContainerFlex: {
    height: "70px",
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  button: {
    fontSize: "13px",
    cursor: "pointer",
    color: "black",
    border: "2px solid white",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "white",
  },
};

export default RouteResultPage;