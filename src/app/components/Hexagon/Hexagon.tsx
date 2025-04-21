import React from "react";
import classes from "./style/Hexagon.module.css";

interface HexagonProps {
  color: string;
  on: boolean;
  height?: number;
  width?: number;
  isVertical?: boolean;
}

const Hexagon: React.FC<HexagonProps> = ({
  color,
  on,
  height = 20,
  width = 60,
  isVertical = false,
}) => {
  return (
    <div
      className={classes.hexagonContainer}
      style={{
        transform: isVertical ? "rotate(180deg)" : "none",
        transformOrigin: "center",
        width: isVertical ? `${height}px` : `${width}px`,
        height: isVertical ? `${width}px` : `${height}px`,
      }}
    >
      <div
        className={`${classes.hexagon} ${on ? classes.on : classes.off}`}
        style={
          {
            backgroundColor: color,
            width: "100%",
            height: "100%",
            "--hexagon-color": color,
          } as React.CSSProperties
        }
      ></div>
    </div>
  );
};

export default Hexagon;
