import React from "react";

const Header = ({ title }) => {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>
        <a href="/" style={styles.link}>{title}</a>
      </h1>
    </div>
  );
};

const styles = {
  header: {
    width: "100%",
    padding: "20px 0px 20px 0px",
    backgroundColor: "white",
    color: "black",
    position: "fixed",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "23px",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
};

export default Header;
