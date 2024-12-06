import React from "react";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div style={styles.footer}>
      <Link to="/" style={styles.link}>
        <AiFillHome size={24} />
      </Link>
      <Link to="/settings" style={styles.link}>
        <AiFillSetting size={24} />
      </Link>
    </div>
  );
};

const styles = {
  footer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    borderTop: "1px solid #ddd",
  },
  link: {
    color: "gray",
    textDecoration: "none",
  },
};

export default Footer;
