import React, { useEffect, useState } from "react";
import { Slider, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { t } from "i18next";

const StreetViewPartial = ({ results, originalPanorama }) => {
  const routeCandidates = results.routes;
  const route = routeCandidates[0];
  const totalImages = route.streetviewUrls.length;
  const allInstructions = [];
  route.all_instructions.forEach((instruction) => {
    allInstructions.push(instruction.replace(/<.*?>/g, " "));
  });
  const uniqueAllInstructions = [...new Set(allInstructions)];
  const routeStepIdsInPanoramaIds = route.routeStepIdsInPanoramaIds;
  let allInstructionsInPanoramaIds = [];
  for (let i = 0; i < routeStepIdsInPanoramaIds.length; i++) {
    allInstructionsInPanoramaIds.push(allInstructions[routeStepIdsInPanoramaIds[i]]);
  };
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(allInstructions[0]);
  const theme = useTheme();
  const color = theme.palette.mode === "dark" ? "white" : "black";

  const angleDifference = Math.abs(route.headings[currentIndex + 1] - route.headings[currentIndex]) <= 10
  ? 0 
  : route.headings[currentIndex + 1] - route.headings[currentIndex];

  const handleArrowClick = (direction) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      return Math.max(0, Math.min(totalImages - 3, newIndex));
    });
  };

  const handleInstructionsArrowClick = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === totalImages - 3 && direction > 0) return totalImages - 3;
      let currentInstructionIndex;
      if (prevIndex === totalImages - 3 && direction < 0) {
        currentInstructionIndex = uniqueAllInstructions.length-1
      } else {
        currentInstructionIndex = uniqueAllInstructions.indexOf(currentInstruction);
      }
      const newInstructionIndex = Math.max(0, Math.min(uniqueAllInstructions.length, currentInstructionIndex + direction));
      const newInstruction = uniqueAllInstructions[newInstructionIndex];
      const newIndex = allInstructionsInPanoramaIds.indexOf(newInstruction);
      if (newInstructionIndex === uniqueAllInstructions.length) return totalImages - 3;
      return Math.max(0, Math.min(totalImages - 3, newIndex));
    });
  };

  const thisYear = new Date().getFullYear();

  useEffect(() => {
    if (currentIndex === totalImages - 3) {
      setCurrentInstruction(t('End of Route'));
    } else {
      setCurrentInstruction(allInstructionsInPanoramaIds[currentIndex]);
    }
  }, [currentIndex]);

  return (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: "75%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* 上部ナビゲーション部分 */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        marginBottom: "10px",
      }}
    >
      {/* 左矢印ボタン */}
      <Box
        onClick={() => handleInstructionsArrowClick(-1)}
        sx={{
          color: color,
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdKeyboardDoubleArrowLeft style={{ fontSize: "30px" }} />
      </Box>

      {/* インストラクションテキスト */}
      <Box
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        {currentInstruction}
      </Box>

      {/* 右矢印ボタン */}
      <Box
        onClick={() => handleInstructionsArrowClick(1)}
        sx={{
          color: color,
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdKeyboardDoubleArrowRight style={{ fontSize: "30px" }} />
      </Box>
    </Box>

    {/* 現在の画像を表示 */}
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={route.streetviewUrls[currentIndex]}
        alt={`Street view ${currentIndex + 1}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* コピーライト表示 */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          fontSize: "10px",
          padding: "2px 5px",
          borderRadius: "4px",
        }}
      >
        © {thisYear} Google
      </div>
    </Box>
    
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
        d="M180,475 l0,-40"
        transform="rotate(0, 180, 440)"
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

    {/* 左右矢印ボタン */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MdKeyboardArrowLeft
        onClick={() => handleArrowClick(-1)}
        style={{ fontSize: "50px", cursor: "pointer" }}
      />
    </Box>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MdKeyboardArrowRight
        onClick={() => handleArrowClick(1)}
        style={{ fontSize: "50px", cursor: "pointer" }}
      />
    </Box>

    {/* スライダー */}
    <Box
      sx={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
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
