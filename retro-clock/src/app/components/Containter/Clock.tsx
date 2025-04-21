"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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

// Production rendering safeguard - this will help fix deployed environment issues
const useProductionSafeEffect = (
  callback: () => void | (() => void),
  deps: React.DependencyList
) => {
  useEffect(() => {
    // In production, we add additional stabilization for rendering
    const timeoutId = setTimeout(callback, 0);
    return () => clearTimeout(timeoutId);
  }, deps);
};

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
}

// Helper function to extract time components
const getTimeComponents = (date: Date, is12Hour: boolean) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // AM/PM indicator for 12-hour format
  let ampm = "";
  if (is12Hour) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for 12 AM
  }

  // Format as digits
  const hourTens = Math.floor(hours / 10);
  const hourOnes = hours % 10;
  const minuteTens = Math.floor(minutes / 10);
  const minuteOnes = minutes % 10;

  return {
    hourTens,
    hourOnes,
    minuteTens,
    minuteOnes,
    ampm,
  };
};

const Clock: React.FC<ClockProps> = ({
  initialColor = "#ff0000",
  showDate = false,
  initialDate,
  blinkColon = true,
  initialFormat = "24h",
}) => {
  // Use refs for intervals to prevent issues with closures and cleanup
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderCountRef = useRef(0);

  // Use a ref to track if component is mounted
  const isMountedRef = useRef(true);

  const [time, setTime] = useState<Date>(initialDate || new Date());
  const [colonVisible, setColonVisible] = useState(true);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">(initialFormat);
  const [colorIndex, setColorIndex] = useState(
    colorOptions.indexOf(initialColor) !== -1
      ? colorOptions.indexOf(initialColor)
      : 0
  );

  // Dedicated state for clock digits to prevent unnecessary re-renders
  const [hourTens, setHourTens] = useState(0);
  const [hourOnes, setHourOnes] = useState(0);
  const [minuteTens, setMinuteTens] = useState(0);
  const [minuteOnes, setMinuteOnes] = useState(0);
  const [amPm, setAmPm] = useState("");

  // Current color from the options - stable between renders
  const currentColor = useMemo(() => colorOptions[colorIndex], [colorIndex]);

  // Function to update digit states based on current time
  const updateDigitStates = useCallback(() => {
    if (!isMountedRef.current) return;

    const now = new Date();
    const is12Hour = timeFormat === "12h";
    const { hourTens, hourOnes, minuteTens, minuteOnes, ampm } =
      getTimeComponents(now, is12Hour);

    // Update states with batched updates
    setHourTens(hourTens);
    setHourOnes(hourOnes);
    setMinuteTens(minuteTens);
    setMinuteOnes(minuteOnes);
    setAmPm(ampm);

    // Also update the time state for other calculations
    setTime(now);
    renderCountRef.current += 1;
  }, [timeFormat]);

  // Force time update function - more aggressive for production
  const forceTimeUpdate = useCallback(() => {
    if (isMountedRef.current) {
      updateDigitStates();
    }
  }, [updateDigitStates]);

  // Production-safe rendering helper
  const ensureProperRender = useCallback(() => {
    // Use immediate update combined with delayed updates
    forceTimeUpdate();

    // Schedule several updates at different time intervals for maximum reliability
    const timings = [16, 32, 100, 200];

    timings.forEach((delay) => {
      setTimeout(() => {
        if (isMountedRef.current) {
          forceTimeUpdate();
        }
      }, delay);
    });
  }, [forceTimeUpdate]);

  // Initial setup and minute-based updates
  useEffect(() => {
    // Ensure we start with the correct time
    ensureProperRender();

    // Setup an interval that checks the time every second
    // but only updates digit states when something has changed
    const checkTimeInterval = setInterval(() => {
      if (!isMountedRef.current) return;

      const now = new Date();
      const is12Hour = timeFormat === "12h";
      const newComponents = getTimeComponents(now, is12Hour);

      // Compare with current state and only update if needed
      const needsUpdate =
        newComponents.hourTens !== hourTens ||
        newComponents.hourOnes !== hourOnes ||
        newComponents.minuteTens !== minuteTens ||
        newComponents.minuteOnes !== minuteOnes ||
        newComponents.ampm !== amPm;

      if (needsUpdate) {
        updateDigitStates();
      }
    }, 1000);

    return () => {
      clearInterval(checkTimeInterval);
    };
  }, [
    ensureProperRender,
    hourTens,
    hourOnes,
    minuteTens,
    minuteOnes,
    amPm,
    timeFormat,
    updateDigitStates,
  ]);

  // Component mount/unmount effect
  useEffect(() => {
    isMountedRef.current = true;

    // Force initial render
    ensureProperRender();

    return () => {
      isMountedRef.current = false;

      // Clear all intervals on unmount
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }

      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };
  }, [ensureProperRender]);

  // Separate effect for colon blinking
  useEffect(() => {
    if (!blinkColon) {
      setColonVisible(true); // Always visible if blinking is disabled
      return;
    }

    // Clear any existing interval
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
    }

    // Blink colon every second for consistency
    blinkIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setColonVisible((prev) => !prev);
      }
    }, 1000);

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };
  }, [blinkColon]);

  // Set up an effect to ensure time stays synced with system clock
  useEffect(() => {
    // Force sync every minute at the exact transition
    const syncWithMinuteChange = () => {
      const now = new Date();
      const secondsToNextMinute = 60 - now.getSeconds();

      // Schedule an update at the next minute boundary
      setTimeout(() => {
        if (isMountedRef.current) {
          ensureProperRender();
          // Start the next iteration
          syncWithMinuteChange();
        }
      }, secondsToNextMinute * 1000);
    };

    // Start the sync cycle
    syncWithMinuteChange();

    // Also sync when the document gains focus or visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ensureProperRender();
      }
    };

    const handleFocus = () => {
      ensureProperRender();
    };

    // Add event listeners to keep clock in sync when user returns to tab
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [ensureProperRender]);

  // Get formatted date for display
  const formattedDate = useMemo(() => {
    const day = time.getDate();
    const month = time.getMonth() + 1; // Months are 0-indexed
    const year = time.getFullYear();

    // Format date display based on locale (MM/DD/YYYY for US)
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  }, [time]);

  // Toggle time format function with extra production-safe updates
  const toggleTimeFormat = useCallback(() => {
    setTimeFormat((prev) => (prev === "24h" ? "12h" : "24h"));

    // Force immediate update for the format change
    setTimeout(() => {
      updateDigitStates();

      // Also schedule multiple delayed updates for maximum reliability
      setTimeout(ensureProperRender, 50);
    }, 0);
  }, [ensureProperRender, updateDigitStates]);

  // Toggle color function with extra production-safe updates
  const toggleColor = useCallback(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colorOptions.length);
  }, []);

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
        {/* Keep all digits in a fixed-width container to prevent layout shifts */}
        <div
          className={classes.digits_container}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "relative",
          }}
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
        </div>

        {/* AM/PM for 12-hour format - use absolute positioning to prevent layout shifts */}
        <div
          className={classes.ampm_container}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {timeFormat === "12h" && (
            <div
              className={classes.ampm}
              style={{
                color: currentColor,
                textShadow: `0 0 5px ${currentColor}`,
              }}
            >
              {amPm}
            </div>
          )}
        </div>
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
