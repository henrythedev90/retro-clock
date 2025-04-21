import React, { useState, useEffect } from "react";
import Digit from "./Digit";
import classes from "./style/Digit.module.css";
import Hexagon from "../Hexagon/Hexagon";

interface ClockProps {
  color?: string;
  showSeconds?: boolean;
}

const Clock: React.FC<ClockProps> = ({ color = "red", showSeconds = true }) => {
  const [time, setTime] = useState(new Date());
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
      setColonVisible((prev) => !prev); // Blink the colon
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Extract hours, minutes, seconds
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Format as digits
  const hourTens = Math.floor(hours / 10);
  const hourOnes = hours % 10;
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;
  const secondTens = Math.floor(seconds / 10);
  const secondOnes = seconds % 10;

  // Colon component for separating hours, minutes, seconds
  const Colon = () => (
    <div className={classes.colon}>
      <Hexagon color={color} on={colonVisible} height={50} width={50} />
      <Hexagon color={color} on={colonVisible} height={50} width={50} />
    </div>
  );

  return (
    <div className={classes.clock_container}>
      <Digit value={hourTens} color={color} />
      <Digit value={hourOnes} color={color} />
      <Colon />
      <Digit value={minuteTens} color={color} />
      <Digit value={minuteOnes} color={color} />

      {showSeconds && (
        <>
          <Colon />
          <Digit value={secondTens} color={color} />
          <Digit value={secondOnes} color={color} />
        </>
      )}
    </div>
  );
};

export default Clock;
