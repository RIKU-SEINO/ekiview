import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "../i18n.js";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="EkiView - Languages" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2>{t('selectLanguage')}</h2> {/* 翻訳されたテキストを表示 */}

        {/* Language Selection Buttons */}
        <div style={styles.languageButtons}>
          <Button text='english' onClick={() => handleLanguageChange('en')} style={styles.languageButton} />
          <Button text='japanese' onClick={() => handleLanguageChange('ja')} style={styles.languageButton} />
          <Button text='chinese' onClick={() => handleLanguageChange('zh')} style={styles.languageButton} />
          <Button text='korean'onClick={() => handleLanguageChange('ko')} style={styles.languageButton} />
          <Button text='spanish' onClick={() => handleLanguageChange('es')} style={styles.languageButton} />
          <Button text='french' onClick={() => handleLanguageChange('fr')} style={styles.languageButton} />
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
  languageButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  languageButton: {
    backgroundColor: "#d3d3d3",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "10px 20px",
    width: "100px"
  },
};

export default SettingsPage;
