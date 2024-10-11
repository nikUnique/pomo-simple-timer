import { memo, useEffect, useState } from "react";
import styles from "./CircularProgressBar.module.css";
import { useTimeData, useTimerData } from "./PomodoroContext";

let firstTime = true;
function CircularProgressBar({ size, strokeWidth, children }) {
  const { selectedTime } = useTimerData();
  const { time } = useTimeData();
  const [rootFontSize, setRootFontSize] = useState(
    getComputedStyle(document.documentElement).fontSize
  );

  useEffect(function () {
    const paceSetter = firstTime ? 0 : 5000;
    firstTime = false;
    const interval = setInterval(function () {
      const newFontSize = getRootFontSize();
      setRootFontSize(newFontSize);
    }, paceSetter);

    return () => clearInterval(interval);
  }, []);

  function getRootFontSize() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  // useEffect(
  //   function () {
  //     const observer = new MutationObserver(function () {
  //       const newFontSize = getComputedStyle(document.documentElement).fontSize;

  //       if (newFontSize !== rootFontSize) {
  //         console.log(newFontSize);
  //         console.log(parseFloat(newFontSize) >= 10 ? newFontSize : "10px");
  //         setRootFontSize(parseFloat(newFontSize) >= 10 ? newFontSize : "10px");
  //       }
  //     });

  //     console.log("observer");

  //     observer.observe(document.documentElement, { attributes: true });

  //     return () => observer.disconnect();
  //   },
  //   [rootFontSize]
  // );

  // console.log(rootFontSize);

  const radius = (size * parseFloat(rootFontSize) - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress =
    time !== 0 ? (time / selectedTime) * 100 : (time / selectedTime) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // console.log(radius);
  // console.log(circumference);
  // console.log(size * parseFloat(rootFontSize));
  // console.log(rootFontSize);

  return (
    <svg className={styles.circularSvg}>
      <circle
        stroke='#f9f9f9'
        fill='transparent'
        strokeWidth={strokeWidth}
        r={radius}
        cx='50%'
        cy='50%'
      />
      <circle
        stroke={time <= 0 ? "#f9f9f9" : "#1098ad"}
        fill='transparent'
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={-strokeDashoffset}
        strokeLinecap='round'
        r={radius}
        cx='50%'
        cy='50%'
        className={styles.progressCircle}
        // style={{
        //   transition: time === 0 ? "all 0.2s linear" : `all ${0.99}s linear`,
        // }}
      />
      <foreignObject
        x={(size * parseFloat(rootFontSize)) / 2 - radius}
        y={(size * parseFloat(rootFontSize)) / 2 - radius}
        width={2 * radius}
        height={2 * radius}
        className={styles.foreignObject}
      >
        <div className={styles.childrenWrapper}>{children}</div>
      </foreignObject>
    </svg>
  );
}

export default memo(CircularProgressBar);
