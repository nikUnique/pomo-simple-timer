import { FaPause, FaPlay, FaPlayCircle } from "react-icons/fa";
import { usePomodoroManager } from "../hooks/usePomodoroManager";
import { useSound } from "../hooks/useSound";
import { useTimer } from "../hooks/useTimer";
import { useModalData, useTimeData, useTimerData } from "./PomodoroContext";

import { memo } from "react";
import { useKey } from "../hooks/useKey";
import styles from "./TimerControl.module.css";

function TimerControl() {
  const { pauseTimeRef, correctedStartTimeRef, time } = useTimeData();
  const { isPaused, isActive, startTimeRef, selectedTime } = useTimerData();
  const { openName } = useModalData();

  useSound();

  const { resumeTimer, startTimer, pauseTimer, resetTimer } = useTimer();

  let timerControl, resetControl;

  const { updatePomodoroEvents, addPomodoroItem } = usePomodoroManager();

  const handleStart = () => {
    const now = performance.now();
    const startTime = performance.timeOrigin + now;
    startTimeRef.current = now;

    correctedStartTimeRef.current =
      Number(String(startTime).slice(-3)) >= 900
        ? Math.ceil(Number(startTime) / 1000) * 1000
        : startTime;

    // console.log(startTime);
    // console.log(correctedStartTimeRef.current);

    startTimer();

    addPomodoroItem(correctedStartTimeRef.current);
  };

  const handlePause = () => {
    pauseTimer();
    updatePomodoroEvents("Paused at " + new Date().toLocaleTimeString());
  };

  const handleResume = () => {
    startTimeRef.current =
      pauseTimeRef.current > 0
        ? performance.now() - (pauseTimeRef.current - startTimeRef.current)
        : performance.now();
    // console.log(startTimeRef.current);
    resumeTimer();
    updatePomodoroEvents("Resumed at " + new Date().toLocaleTimeString());
  };

  if (!isActive) timerControl = handleStart;
  if (isActive && isPaused) timerControl = handleResume;
  if (isActive && !isPaused) timerControl = handlePause;
  if (isActive && isPaused) resetControl = resetTimer;

  const shouldListen = openName;
  // console.log(shouldListen);

  useKey({ key: "space" }, timerControl, !shouldListen);
  useKey(
    { shift: true, key: "keyR" },
    () => resetControl?.(selectedTime),
    !shouldListen
  );

  return (
    <div className={styles.buttons}>
      <button
        onClick={
          isActive ? (isPaused ? handleResume : handlePause) : handleStart
        }
        className={`${
          (isActive && isPaused && styles.pausedTimer) ||
          (isActive && !isPaused && styles.runningTimer)
        }`}
        disabled={!isActive && time === 0}
      >
        {(isActive &&
          (isPaused ? (
            <div className={styles.timerButtonContainer}>
              <FaPlayCircle /> Resume
            </div>
          ) : (
            <div className={styles.timerButtonContainer}>
              <FaPause /> Pause
            </div>
          ))) || (
          <div className={styles.timerButtonContainer}>
            <FaPlay /> Start
          </div>
        )}
      </button>
    </div>
  );
}

export default memo(TimerControl);
