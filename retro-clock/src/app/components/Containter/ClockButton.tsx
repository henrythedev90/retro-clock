"use client";
import React, { ButtonHTMLAttributes } from "react";
import classes from "./style/Digit.module.css";

interface ClockButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
  variant?: "default" | "small" | "large";
  children: React.ReactNode;
  onClick?: () => void;
}

const ClockButton: React.FC<ClockButtonProps> = ({
  color = "#ff0000",
  variant = "default",
  children,
  className,
  disabled,
  onClick,
  ...props
}) => {
  // Derive size classes based on variant
  const sizeClass =
    variant === "small"
      ? classes.button_small
      : variant === "large"
      ? classes.button_large
      : "";

  // Set style based on enabled/disabled state
  const buttonStyle = {
    borderColor: color,
    color: color,
    textShadow: disabled ? "none" : `0 0 3px ${color}`,
  };

  return (
    <button
      className={`${classes.clock_button} ${sizeClass} ${className || ""}`}
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ClockButton;
