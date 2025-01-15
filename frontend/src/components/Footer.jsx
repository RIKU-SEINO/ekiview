import React from "react";
import { AiFillHome } from "react-icons/ai";
import { MdLanguage } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div style={styles.footer}>
      <Link to="/home" style={styles.link}>
        <div style={styles.iconContainer}>
          <AiFillHome size={24} />
          <span style={styles.iconText}>{t('Home')}</span>
        </div>
      </Link>
      <Link to="/settings" style={styles.link}>
        <div style={styles.iconContainer}>
          <MdLanguage size={24} />
          <span style={styles.iconText}>{t('Language')}</span>
        </div>
      </Link>
    </div>
  );
};

const styles = {
  footer: {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    borderTop: "1px solid #ddd",
    zIndex: 1000,
  },

  link: {
    color: "gray",
    textDecoration: "none",
    textAlign: "center",
  },

  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  iconText: {
    fontSize: "12px",
    marginTop: "5px",
    color: "gray",
  },
};

export default Footer;

