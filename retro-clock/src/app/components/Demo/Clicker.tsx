"use client";
import React, { useState } from "react";
import Digit from "../Containter/Digit";
import ClockButton from "../Containter/ClockButton";

// Preset color options - same as in Clock component
const colorOptions = [
  "#ff0000", // Red
  "#00ff00", // Green
  "#00ffff", // Cyan
  "#ff9900", // Amber
  "#ff00ff", // Magenta
];

const Clicker: React.FC = () => {
  const [count, setCount] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  // Current color from the options
  const currentColor = colorOptions[colorIndex];

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const toggleColor = () => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colorOptions.length);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
        border: `2px solid ${currentColor}`,
        padding: "15px",
        borderRadius: "15px",
      }}
    >
      <h1
        style={{ color: currentColor, textShadow: `0 0 5px ${currentColor}` }}
      >
        Clicker
      </h1>

      <Digit value={count} color={currentColor} />

      <div style={{ display: "flex", gap: "10px" }}>
        <ClockButton
          onClick={handleIncrement}
          disabled={count >= 9}
          color={currentColor}
        >
          Increment
        </ClockButton>

        <ClockButton
          onClick={handleDecrement}
          disabled={count <= 0}
          color={currentColor}
        >
          Decrement
        </ClockButton>

        <ClockButton onClick={toggleColor} color={currentColor}>
          COLOR
        </ClockButton>
      </div>
    </div>
  );
};

export default Clicker;
