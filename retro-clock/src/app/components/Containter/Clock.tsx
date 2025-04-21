"use client";
import React, { useState, useEffect } from "react";
import Digit from "./Digit";
import classes from "./style/Clock.module.css";
import Hexagon from "../Hexagon/Hexagon";
import ClockButton from "./ClockButton";
import Link from "next/link";
// Preset color options
const colorOptions = [
  "#ff0000", // Red
  "#00ff00", // Green
  "#00ffff", // Cyan
  "#ff9900", // Amber
  "#ff00ff", // Magenta
];

interface ClockProps {
  initialColor?: string;
  showSeconds?: boolean;
  initialDate?: Date;
  blinkColon?: boolean;
  showDate?: boolean;
  initialFormat?: "12h" | "24h";
}

const Clock: React.FC<ClockProps> = ({
  initialColor = "#ff0000",
  showSeconds = true,
  showDate = false,
  initialDate,
  blinkColon = true,
  initialFormat = "24h",
}) => {
  const [time, setTime] = useState<Date>(initialDate || new Date());
  const [colonVisible, setColonVisible] = useState(true);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">(initialFormat);
  const [colorIndex, setColorIndex] = useState(
    colorOptions.indexOf(initialColor) !== -1
      ? colorOptions.indexOf(initialColor)
      : 0
  );

  // Current color from the options
  const currentColor = colorOptions[colorIndex];

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
      if (blinkColon) {
        setColonVisible((prev) => !prev);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blinkColon]);

  // Extract hours, minutes, seconds
  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // AM/PM indicator for 12-hour format
  let ampm = "";
  if (timeFormat === "12h") {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for 12 AM
  }

  // Format as digits - ensure hours are always 2 digits
  const hourTens = Math.floor(hours / 10);
  const hourOnes = hours % 10;
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  // Get date components
  const day = time.getDate();
  const month = time.getMonth() + 1; // Months are 0-indexed
  const year = time.getFullYear();

  // Colon component for separating hours, minutes, seconds
  const Colon = () => (
    <div className={classes.colon}>
      <Hexagon
        color={currentColor}
        on={colonVisible || !blinkColon}
        height={8}
        width={8}
      />
      <Hexagon
        color={currentColor}
        on={colonVisible || !blinkColon}
        height={8}
        width={8}
      />
    </div>
  );

  // Format date display based on locale (MM/DD/YYYY for US)
  const formattedDate = `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;

  // Toggle time format function
  const toggleTimeFormat = () => {
    setTimeFormat((prev) => (prev === "24h" ? "12h" : "24h"));
  };

  // Toggle color function
  const toggleColor = () => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colorOptions.length);
  };

  return (
    <div className={classes.clock_wrapper}>
      <div className={classes.date_display}>
        <h1 style={{ color: currentColor }}>digital_retro_clock</h1>
        <Link href={"https://www.henry-nunez.com"}>
          <p style={{ color: currentColor }}>Henry_nunez</p>
        </Link>
      </div>
      <div className={classes.clock_container}>
        {/* Hours - always show 2 digits */}
        <Digit value={hourTens} color={currentColor} />
        <Digit value={hourOnes} color={currentColor} />

        <Colon />

        {/* Minutes */}
        <Digit value={minuteTens} color={currentColor} />
        <Digit value={minuteOnes} color={currentColor} />

        {/* Seconds (optional) */}
        {showSeconds && (
          <>
            <Colon />
            <Digit value={secondTens} color={currentColor} />
            <Digit value={secondOnes} color={currentColor} />
          </>
        )}

        {/* AM/PM for 12-hour format */}
        {timeFormat === "12h" && (
          <div
            className={classes.ampm}
            style={{
              color: currentColor,
              textShadow: `0 0 5px ${currentColor}`,
            }}
          >
            {ampm}
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className={classes.controls}>
        <ClockButton onClick={toggleTimeFormat} color={currentColor}>
          {timeFormat === "24h" ? "24H" : "12H"}
        </ClockButton>

        <ClockButton onClick={toggleColor} color={currentColor}>
          COLOR
        </ClockButton>
      </div>

      {/* Date display (optional) */}
      {showDate && (
        <div
          className={classes.date_display}
          style={{ color: currentColor, textShadow: `0 0 5px ${currentColor}` }}
        >
          {formattedDate}
        </div>
      )}
    </div>
  );
};

export default Clock;
