import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from "../components/Button";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "404 Not Found - EkiView";
  });

  const redirectToHome = () => {
    navigate("/");
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="EkiView - 404 Not Found" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.subContent}>
          <h1 style={styles.errorTitle}>404</h1>
          <p style={styles.errorMessage}>{t('The page you are looking for does not exist')}</p>
          <Button text={t('Go to Home')} onClick={redirectToHome} style={styles.redirectButton} />
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
    margin: "0 auto",
    width: "80%",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: "72px",
    margin: "20px 0",
  },
  errorMessage: {
    fontSize: "17px",
    color: "#333",
  },
  redirectButton: {
    display: "block",
    margin: "10px auto",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default NotFound;
