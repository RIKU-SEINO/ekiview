import React from "react";

const InputField = ({ placeholder, value, onChange }) => {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    margin: "10px 0",
    display: "flex",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
  },
};

export default InputField;
