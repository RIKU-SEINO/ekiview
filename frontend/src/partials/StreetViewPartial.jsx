import React, { useState } from "react";
import { Slider, Box } from "@mui/material";

const StreetViewPartial = ({ results }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const routeCandidates = results.routes;
  const route = routeCandidates[0];
  const totalImages = route.streetviewUrls.length;
  const angleDifference = currentIndex === 0 || Math.abs(route.headings[currentIndex + 1] - route.headings[currentIndex - 1]) <= 10
  ? 0 
  : route.headings[currentIndex + 1] - route.headings[currentIndex - 1];

  const handleArrowClick = (direction) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      return Math.max(0, Math.min(totalImages - 3, newIndex));
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "400px",
        overflow: "hidden",
      }}
    >
      {/* 現在の画像を表示 */}
      <img
        src={route.streetviewUrls[currentIndex]}
        alt={`Street view ${currentIndex + 1}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 800"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "400px",
          zIndex: 1000,
        }}
      >
        {/* 矢印の垂直な直線部分 */}
        <path
          d="M180,535 l0,-100"
          transform={`rotate(0, 180, 440)`}
          style={{
            fill: "none",
            stroke: "rgb(255, 85, 0)",
            strokeWidth: "8px",
          }}
        />

        {/* 矢印の動的な上部部分 */}
        <path
          d="M180,440 l0,-50 l15,0 l-15,-30 l-15,30 l15,0"
          transform={`rotate(${angleDifference}, 180, 440)`}
          style={{
            fill: "rgb(255, 85, 0)",
            stroke: "rgb(255, 85, 0)",
            strokeWidth: "8px",
          }}
        />
      </svg>

      {/* 左矢印ボタン */}
      <Box
        onClick={() => handleArrowClick(-1)}
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          color: "white",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 2000,
        }}
      >
        ◀
      </Box>

      {/* 右矢印ボタン */}
      <Box
        onClick={() => handleArrowClick(1)}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          color: "white",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 2000,
        }}
      >
        ▶
      </Box>

      {/* スライダー */}
      <Box
        sx={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "85%",
        }}
      >
        <Slider
          value={currentIndex}
          min={0}
          max={totalImages - 3}
          step={1}
          onChange={(event, newValue) => setCurrentIndex(newValue)}
          marks
          valueLabelDisplay="auto"
          sx={{
            color: "white",
            "& .MuiSlider-thumb": {
              backgroundColor: "white",
            },
            "& .MuiSlider-track": {
              backgroundColor: "white",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "gray",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default StreetViewPartial;
