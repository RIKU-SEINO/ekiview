import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { t } from "i18next";

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
`;

const FlashOverlay = ({ message = t('Failed to retrieve street view images for part of the route'), duration = 4000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: "49%",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        backgroundColor: "rgba(218, 190, 190, 1)",
        color: "black",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "8.5px",
        fontWeight: "bold",
        border: "1px solid rgba(255, 0, 0, 0.5)",
        zIndex: 9999,
        pointerEvents: "none",
        animation: `${fadeInOut} ${duration}ms ease-in-out`,
      }}
    >
      {message}
    </Box>
  );
};

export default FlashOverlay;
