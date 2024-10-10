import { useTimer } from "../hooks/useTimer";
import {
  useNotificationData,
  useSettingsData,
  useTimerData,
} from "./PomodoroContext";
import styles from "./SessionSelector.module.css";

function SessionSelector() {
  const {
    selectedTime,
    setSelectedTime,
    setIsPaused,
    isPaused,
    isActive,
    setIsActive,
  } = useTimerData();

  const { currentAudioRef, alarmIsStopped } = useNotificationData();

  const {
    setTime,
    inputFocus,
    inputShortBreak,
    inputLongBreak,
    selectedSession,
    setSelectedSession,
    setCurrentSessionIndex,
    allSessions,

    pomodoroCycles,
  } = useSettingsData();

  const { resetTimer } = useTimer();

  function defineSessionTime(session) {
    if (session === "focus") return inputFocus * 60;
    if (session === "short_break") return inputShortBreak * 60;
    if (session === "long_break") return inputLongBreak * 60;
  }

  function handleSessionClick(session) {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (isActive) {
      resetTimer(selectedTime);
    }

    setIsActive(false);
    setIsPaused(false);
    setSelectedSession(session);
    setTime(defineSessionTime(session));
    setSelectedTime(defineSessionTime(session));

    if (session === selectedSession) {
      console.log("This session was already selected");
      return;
    }

    setCurrentSessionIndex((cur) => {
      if (session === "focus" && selectedSession !== "long_break")
        return cur - 1;

      if (session === "short_break" && selectedSession !== "long_break")
        return cur + 1;

      if (session === "focus" && selectedSession === "long_break") return 0;

      if (session === "short_break" && selectedSession === "long_break")
        return 1;

      if (session === "long_break") return allSessions.length - 1;
    });
  }

  return (
    <div className={styles.sessionSelectContainer}>
      <div className={styles.sessionSelector}>
        <button
          className={`${styles.sessionBtn} ${
            selectedSession === "focus" && styles.sessionBtnActive
          }`}
          onClick={() => handleSessionClick("focus")}
          disabled={(!isPaused && isActive) || (!isActive && !alarmIsStopped)}
        >
          Focus time
        </button>
        <button
          className={`${styles.sessionBtn} ${
            selectedSession === "short_break" && styles.sessionBtnActive
          }`}
          onClick={(e) => handleSessionClick("short_break")}
          disabled={
            (!isPaused && isActive) ||
            (!isActive && !alarmIsStopped) ||
            pomodoroCycles === 1
          }
        >
          Short break
        </button>
        <button
          className={`${styles.sessionBtn} ${
            selectedSession === "long_break" && styles.sessionBtnActive
          }`}
          onClick={(e) => handleSessionClick("long_break")}
          disabled={(!isPaused && isActive) || (!isActive && !alarmIsStopped)}
        >
          Long break
        </button>
      </div>
    </div>
  );
}

export default SessionSelector;
