import React, { useEffect, useState } from "react";
import "../../styles/clock.css"
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to convert English digits to Bengali digits
  const convertToBengaliDigits = (num) => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[digit]);
  };

  // Format the time (HH:MM:SS) and convert to Bengali
  const getFormattedTime = () => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");

    return convertToBengaliDigits(`${hours}:${minutes}:${seconds}`);
  };

  return (
    <div className="clock-container">
      <h1 className="clock solaimanlipi">{getFormattedTime()}</h1>
    </div>
  );
};

export default Clock;
