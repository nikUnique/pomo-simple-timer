import { useRef } from "react";
import { useTimer } from "../hooks/useTimer";
import { useTimeData, useTimerData } from "./PomodoroContext";
import styles from "./Time.module.css";
function Time() {
  const { time } = useTimeData();
  const { selectedTime, isActive, isPaused, isTimeUp, timerMode } =
    useTimerData();
  const { resetTimer } = useTimer();

  const handleReset = () => {
    resetTimer(selectedTime);
  };

  const timeDisplayRef = useRef(null);
  const hours = String(Math.floor(time / 3600));
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(Math.floor(time % 60)).padStart(2, "0");

  return (
    <div>
      <div className={styles.timeContainer}>
        {isPaused && !isTimeUp && (
          <div className={styles.alert}>Timer is paused!</div>
        )}
        {isTimeUp && <div className={styles.alert}>{"Time's up!"}</div>}
        <div className={styles.time} ref={timeDisplayRef}>
          {Number(hours) > 0 ? (
            <span
              className={hours?.at(1) ? styles.hoursDouble : styles.hoursSingle}
            >
              {hours}
            </span>
          ) : (
            ""
          )}

          {Number(hours) > 0 && (
            <span className={styles.hoursSeparator}>:</span>
          )}
          <span className={styles.minutes}>{minutes}</span>

          <span
            className={`${styles.minutesSeparator} ${styles.secondSeparator}`}
          >
            :
          </span>
          <span className={styles.seconds}>{seconds}</span>
        </div>
      </div>
      {timerMode === "simple_timer_mode" && (
        <button
          onClick={handleReset}
          className={`${styles.resetButton} ${
            isActive && isPaused ? "" : styles.hidden
          }`}
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default Time;
