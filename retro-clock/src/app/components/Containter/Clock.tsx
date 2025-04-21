"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
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

// Define Colon component outside the main component
const ColonComponent = ({
  color,
  visible,
  blinkEnabled,
}: {
  color: string;
  visible: boolean;
  blinkEnabled: boolean;
}) => (
  <div className={classes.colon}>
    <Hexagon color={color} on={visible || !blinkEnabled} height={8} width={8} />
    <Hexagon color={color} on={visible || !blinkEnabled} height={8} width={8} />
  </div>
);
ColonComponent.displayName = "Colon";

interface ClockProps {
  initialColor?: string;
  showSeconds?: boolean;
  initialDate?: Date;
  blinkColon?: boolean;
  showDate?: boolean;
  initialFormat?: "12h" | "24h";
  updateInterval?: number; // Time update interval in milliseconds
}

const Clock: React.FC<ClockProps> = ({
  initialColor = "#ff0000",
  showDate = false,
  initialDate,
  blinkColon = true,
  initialFormat = "24h",
  updateInterval = 1000, // Default update interval is 1 second
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
  const currentColor = useMemo(() => colorOptions[colorIndex], [colorIndex]);

  useEffect(() => {
    // Update time based on the provided interval
    const timeInterval = setInterval(() => {
      // Use functional update to ensure we're working with the latest state
      setTime(new Date());
    }, updateInterval);

    // Return cleanup function
    return () => clearInterval(timeInterval);
  }, [updateInterval]); // Add updateInterval as a dependency

  // Separate effect for colon blinking
  useEffect(() => {
    if (!blinkColon) return;

    // Blink colon at the same rate as time updates for consistency
    // or at least every second if time updates less frequently
    const blinkRate = Math.min(updateInterval, 1000);

    const blinkInterval = setInterval(() => {
      setColonVisible((prev) => !prev);
    }, blinkRate);

    return () => clearInterval(blinkInterval);
  }, [blinkColon, updateInterval]);

  // Extract time components using memoization to reduce recalculations
  const timeComponents = useMemo(() => {
    let hours = time.getHours();
    const minutes = time.getMinutes();

    // AM/PM indicator for 12-hour format
    let ampm = "";
    if (timeFormat === "12h") {
      ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for 12 AM
    }

    // Format as digits
    const hourTens = Math.floor(hours / 10);
    const hourOnes = hours % 10;
    const minuteTens = Math.floor(minutes / 10);
    const minuteOnes = minutes % 10;

    // Get date components
    const day = time.getDate();
    const month = time.getMonth() + 1; // Months are 0-indexed
    const year = time.getFullYear();

    // Format date display based on locale (MM/DD/YYYY for US)
    const formattedDate = `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;

    return {
      hourTens,
      hourOnes,
      minuteTens,
      minuteOnes,
      ampm,
      formattedDate,
    };
  }, [time, timeFormat]);

  // Toggle time format function - use useCallback to prevent unnecessary re-renders
  const toggleTimeFormat = useCallback(() => {
    setTimeFormat((prev) => (prev === "24h" ? "12h" : "24h"));
  }, []);

  // Toggle color function - use useCallback to prevent unnecessary re-renders
  const toggleColor = useCallback(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colorOptions.length);
  }, []);

  const { hourTens, hourOnes, minuteTens, minuteOnes, ampm, formattedDate } =
    timeComponents;

  return (
    <div className={classes.clock_wrapper}>
      <div className={classes.date_display}>
        <h1 style={{ color: currentColor }}>digital_retro_clock</h1>
        <Link href={"https://www.henry-nunez.com"}>
          <p style={{ color: currentColor }}>Henry_nunez</p>
        </Link>
      </div>
      <div
        className={classes.clock_container}
        style={{ border: `2px solid ${currentColor}` }}
      >
        {/* Hours - always show 2 digits */}
        <Digit value={hourTens} color={currentColor} />
        <Digit value={hourOnes} color={currentColor} />

        <ColonComponent
          color={currentColor}
          visible={colonVisible}
          blinkEnabled={blinkColon}
        />

        {/* Minutes */}
        <Digit value={minuteTens} color={currentColor} />
        <Digit value={minuteOnes} color={currentColor} />

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
