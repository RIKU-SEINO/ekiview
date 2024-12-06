import React from "react";

const Button = ({ text, onClick, style }) => {
  return (
    <button onClick={onClick} style={{ ...styles.button, ...style }}>
      {text}
    </button>
  );
};

const styles = {
  button: {
    width: "100%",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "30px",
  },
};

export default Button;
