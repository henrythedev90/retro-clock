"use client";
import styles from "./page.module.css";
import Clock from "./components/Containter/Clock";
import Clicker from "./components/Demo/Clicker";
import Digit from "./components/Containter/Digit";
import { useState } from "react";
import ClockButton from "./components/Containter/ClockButton";
const colorOptions = [
  "#ff0000", // Red
  "#00ff00", // Green
  "#00ffff", // Cyan
  "#ff9900", // Amber
  "#ff00ff", // Magenta
];

export default function Home() {
  const [colorIndex, setColorIndex] = useState(0);

  const currentColor = colorOptions[colorIndex];
  const toggleColor = () => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colorOptions.length);
  };
  return (
    <div className={styles.page}>
      <Clicker />
      <Clock initialColor={currentColor} showSeconds={true} showDate={true} />
      <div className={styles.digit_container}>
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <Digit key={i} value={i} color={currentColor} />
          ))}
        </div>
        <ClockButton onClick={toggleColor} color={currentColor}>
          COLOR
        </ClockButton>
      </div>
    </div>
  );
}
