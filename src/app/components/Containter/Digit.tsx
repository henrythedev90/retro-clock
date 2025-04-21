import React from "react";
import Hexagon from "../Hexagon/Hexagon";
import classes from "./style/Digit.module.css";

interface DigitProps {
  value: number; // 0-9
  color?: string;
}

const Digit: React.FC<DigitProps> = ({ value, color = "#ff0000" }) => {
  // Segment activation patterns for digits 0-9
  const segmentPatterns = [
    [true, true, true, true, true, true, false], // 0
    [false, true, true, false, false, false, false], // 1
    [true, true, false, true, true, false, true], // 2
    [true, true, true, true, false, false, true], // 3
    [false, true, true, false, false, true, true], // 4
    [true, false, true, true, false, true, true], // 5
    [true, false, true, true, true, true, true], // 6
    [true, true, true, false, false, false, false], // 7
    [true, true, true, true, true, true, true], // 8
    [true, true, true, true, false, true, true], // 9
  ];

  // Get the segment pattern for the current value
  const pattern = segmentPatterns[value % 10] || segmentPatterns[0];

  // Destructure for readability
  const [segA, segB, segC, segD, segE, segF, segG] = pattern;

  // Different sizes for horizontal and vertical segments
  const horizontalProps = { width: 40, height: 12 };
  const verticalProps = { width: 40, height: 12, isVertical: true };

  return (
    <div className={classes.digit_container}>
      {/* Segment A (top horizontal) */}
      <div className={classes.segment_a}>
        <Hexagon color={color} on={segA} {...horizontalProps} />
      </div>

      {/* Segment F (top left vertical) and B (top right vertical) */}
      <div className={classes.segment_f_b}>
        <Hexagon color={color} on={segF} {...verticalProps} />
        <Hexagon color={color} on={segB} {...verticalProps} />
      </div>

      {/* Segment G (middle horizontal) */}
      <div className={classes.segment_g}>
        <Hexagon color={color} on={segG} {...horizontalProps} />
      </div>

      {/* Segment E (bottom left vertical) and C (bottom right vertical) */}
      <div className={classes.segment_e_c}>
        <Hexagon color={color} on={segE} {...verticalProps} />
        <Hexagon color={color} on={segC} {...verticalProps} />
      </div>

      {/* Segment D (bottom horizontal) */}
      <div className={classes.segment_d}>
        <Hexagon color={color} on={segD} {...horizontalProps} />
      </div>
    </div>
  );
};

export default Digit;
