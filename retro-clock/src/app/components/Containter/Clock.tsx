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
  // Force re-renders more aggressively in production with this state
  const [, setForceRender] = useState(0);

  // Current color from the options - stable between renders
  const currentColor = useMemo(() => colorOptions[colorIndex], [colorIndex]);

  // Force time update function - more aggressive for production
  const forceTimeUpdate = useCallback(() => {
    if (isMountedRef.current) {
      const now = new Date();
      setTime(now);

      // Force a re-render separately from the time update
      // This helps in production environments
      setForceRender((prev) => prev + 1);

      // Count renders to help with debugging and stabilization
      renderCountRef.current += 1;
    }
  }, []);

  // Production-safe rendering helper
  const ensureProperRender = useCallback(() => {
    // First force an update
    forceTimeUpdate();

    // Then use a cascading sequence of renders at different timings
    // This helps in production where rendering might be throttled differently
    const timings = [0, 16, 32, 64, 100, 200];

    timings.forEach((delay) => {
      setTimeout(() => {
        if (isMountedRef.current) {
          forceTimeUpdate();

          // Use requestAnimationFrame for the optimal timing with the browser's render cycle
          requestAnimationFrame(() => {
            if (isMountedRef.current) {
              forceTimeUpdate();
            }
          });
        }
      }, delay);
    });
  }, [forceTimeUpdate]);

  // Setup interval for updating time
  useEffect(() => {
    // Initial force update with the production-safe approach
    ensureProperRender();

    // Clear any existing interval
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    // Ensure time updates every second regardless of other settings
    // This guarantees we always have accurate time
    timeIntervalRef.current = setInterval(() => {
      forceTimeUpdate();
    }, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    };
  }, [forceTimeUpdate, ensureProperRender]);

  // Component mount/unmount effect
  useEffect(() => {
    isMountedRef.current = true;

    // Request animation frame to ensure time is updated in sync with browser
    const animationFrameId = requestAnimationFrame(() => {
      ensureProperRender();
    });

    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(animationFrameId);

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

  // Use a more aggressive synchronization approach for production
  useProductionSafeEffect(() => {
    // Force updates on a regular schedule to prevent drift
    ensureProperRender();
  }, [time]);

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

        // Whenever colon visibility changes, ensure digits are properly updated too
        // This helps fix production environment issues
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setForceRender((prev) => prev + 1);
          }
        });
      }
    }, 1000);

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };
  }, [blinkColon]);

  // Debounce mechanism for hexagon filling - improved for production
  const debounceTimeUpdate = useCallback(() => {
    // Force immediate time update then schedule a series of updates
    ensureProperRender();
  }, [ensureProperRender]);

  // Set up an effect to ensure time stays synced with system clock
  useEffect(() => {
    // Sync time immediately and then every 10 seconds to avoid drift
    // More frequent in production to handle potential issues
    const syncInterval = setInterval(() => {
      debounceTimeUpdate();
    }, 10000);

    // Also sync when the document gains focus or visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        debounceTimeUpdate();
      }
    };

    const handleFocus = () => {
      debounceTimeUpdate();
    };

    // Additional events for mobile browsers
    const handleOnline = () => {
      debounceTimeUpdate();
    };

    const handleResize = () => {
      debounceTimeUpdate();
    };

    // Add event listeners to keep clock in sync when user returns to tab
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("resize", handleResize);
    };
  }, [debounceTimeUpdate]);

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

  // Toggle time format function with extra production-safe updates
  const toggleTimeFormat = useCallback(() => {
    setTimeFormat((prev) => (prev === "24h" ? "12h" : "24h"));

    // Use the production-safe approach for toggling
    ensureProperRender();
  }, [ensureProperRender]);

  // Toggle color function with extra production-safe updates
  const toggleColor = useCallback(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colorOptions.length);

    // Use the production-safe approach for toggling
    ensureProperRender();
  }, [ensureProperRender]);

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
              {ampm}
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
