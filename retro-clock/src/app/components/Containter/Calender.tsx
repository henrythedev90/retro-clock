"use client";
import React, { useState, useEffect } from "react";
import Digit from "../Containter/Digit";
import classes from "./style/Calender.module.css";
import ClockButton from "./ClockButton";

interface CalenderProps {
  date: Date;
  initialColor?: string;
}

const getCalenderComponents = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const dayOfMonth = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  //   const dayTens = parseInt(day.slice(0, 1), 10);
  //   const dayOnes = parseInt(day.slice(1, 2), 10);
  const monthTens = parseInt(month.slice(0, 1), 10);
  const monthOnes = parseInt(month.slice(1, 2), 10);
  const dayOfMonthTens = parseInt(dayOfMonth.toString().slice(0, 1), 10);
  const dayOfMonthOnes = parseInt(dayOfMonth.toString().slice(1, 2), 10);
  const yearThousands = parseInt(year.toString().slice(0, 1), 10);
  const yearHundreds = parseInt(year.toString().slice(1, 2), 10);
  const yearTens = parseInt(year.toString().slice(2, 3), 10);
  const yearOnes = parseInt(year.toString().slice(3, 4), 10);

  return {
    monthTens,
    monthOnes,
    dayOfMonthTens,
    dayOfMonthOnes,
    yearThousands,
    yearHundreds,
    yearTens,
    yearOnes,
  };
};
const Calender = ({ date, initialColor }: CalenderProps) => {
  const [calenderComponents, setCalenderComponents] = useState(
    getCalenderComponents(date)
  );
  useEffect(() => {
    setCalenderComponents(getCalenderComponents(date));
  }, [date]);

  return (
    <div className={classes.calender_container}>
      <Digit value={calenderComponents.monthTens} color={initialColor} />
      <Digit value={calenderComponents.monthOnes} color={initialColor} />
      <p>/</p>
      <Digit value={calenderComponents.dayOfMonthTens} color={initialColor} />
      <Digit value={calenderComponents.dayOfMonthOnes} color={initialColor} />
      <p>/</p>
      <Digit value={calenderComponents.yearTens} color={initialColor} />
      <Digit value={calenderComponents.yearOnes} color={initialColor} />
    </div>
  );
};

export default Calender;
