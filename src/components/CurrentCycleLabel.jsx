import { useEffect } from "react";
import { FaRedo } from "react-icons/fa";
import { FaForwardStep } from "react-icons/fa6";
import { useTimer } from "../hooks/useTimer.js";
import {
  useNotificationData,
  useSettingsData,
  useTimerData,
} from "./PomodoroContext";
import styles from "./SessionSelector.module.css";
function CurrentCycleLabel() {
  const {
    selectedTime,
    setSelectedTime,
    isPaused,
    isActive,
    setIsActive,
    setIsPaused,
  } = useTimerData();

  const { currentAudioRef, alarmIsStopped } = useNotificationData();
  const {
    setTime,
    selectedSession,
    currentSessionIndex,
    allSessions,
    pomodoroCycles,
    setCurrentSessionIndex,
    setSelectedSession,
    inputFocus,
    inputShortBreak,
    inputLongBreak,

    setAllSessions,
  } = useSettingsData();

  const { resetTimer } = useTimer();

  function generateNewSessions(_, i, arr) {
    if ((i + 1) % 2 !== 0) return "focus";
    if ((i + 1) % 2 === 0 && arr.length - 1 !== i) return "short_break";
    if ((i + 1) % 2 === 0) return "long_break";
  }

  useEffect(
    function () {
      const preparedEmptyArr = Array.from(
        { length: pomodoroCycles * 2 },
        () => ""
      );
      const generatedSessions = preparedEmptyArr.map(generateNewSessions);
      setAllSessions(generatedSessions);
    },
    [setAllSessions, pomodoroCycles]
  );

  function defineSessionTime(session) {
    if (session === "focus") return inputFocus * 60;
    if (session === "short_break") return inputShortBreak * 60;
    if (session === "long_break") return inputLongBreak * 60;
  }

  function handleNextSessionClick() {
    if (isActive) {
      resetTimer(selectedTime);
    }
    // console.log(allSessions);
    setIsActive(false);
    setIsPaused(false);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    setCurrentSessionIndex((cur) => {
      if (selectedSession === "long_break") {
        return 0;
      }
      if (selectedSession !== "long_break") {
        return cur + 1;
      }
    });

    setSelectedSession((cur) => {
      if (cur === "long_break") {
        return "focus";
      }
      if (cur !== "long_break") {
        return allSessions[currentSessionIndex + 1];
      }
    });

    if (selectedSession === "long_break") {
      setTime(defineSessionTime("focus"));
      setSelectedTime(defineSessionTime("focus"));
    }

    if (selectedSession !== "long_break") {
      // console.log("time should be set");
      setTime(defineSessionTime(allSessions[currentSessionIndex + 1]));
      setSelectedTime(defineSessionTime(allSessions[currentSessionIndex + 1]));
    }
  }

  CurrentCycleLabel.handleNextSessionClick = handleNextSessionClick;

  return (
    <div className={styles.currentCycleLabel}>
      <div className={styles.currentSessionLabel}>
        <span>
          {allSessions[currentSessionIndex] === "focus" && (
            <span>Focus Time</span>
          )}
        </span>
        <span>
          {allSessions[currentSessionIndex] === "short_break" && (
            <span>Short Break</span>
          )}
        </span>
        <span>
          {allSessions[currentSessionIndex] === "long_break" && (
            <span>Long Break -</span>
          )}
        </span>
        &nbsp;
        {selectedSession !== "long_break" && (
          <span>
            ({Math.ceil((currentSessionIndex + 1) / 2) + `/` + pomodoroCycles})
          </span>
        )}
        <span>
          {selectedSession === "long_break" && `Series Complete`} &nbsp;
        </span>
      </div>
      {
        <div
          className={`${styles.nextSession} ${
            ((isActive && !isPaused) || (!isActive && !alarmIsStopped)) &&
            styles.hidden
          }`}
          onClick={handleNextSessionClick}
        >
          {selectedSession === "long_break" && (
            <span className={styles.restartSeries}>
              <FaRedo className={styles.icon} />
              <span className={styles.restartLabel}>Restart&nbsp;</span>
            </span>
          )}
          {selectedSession !== "long_break" && (
            <button
              disabled={
                (!isPaused && isActive) || (!isActive && !alarmIsStopped)
              }
            >
              <FaForwardStep className={styles.icon} />
            </button>
          )}
        </div>
      }
    </div>
  );
}

export default CurrentCycleLabel;
