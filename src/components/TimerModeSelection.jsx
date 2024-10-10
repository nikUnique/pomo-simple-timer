import { useTime } from "../hooks/useTime";
import {
  useNotificationData,
  useSettingsData,
  useTimerData,
} from "./PomodoroContext";
import styles from "./Settings.module.css";
import TimeInputForm from "./TimeInputForm";
function TimerModeSelection() {
  const { currentAudioRef, isAlarmPlaying } = useNotificationData();

  const { timerMode, setTimerMode, setSelectedTime, setIsTimeUp, isActive } =
    useTimerData();
  const {
    setTime,
    setSelectedSession,
    setCurrentSessionIndex,
    inputFocus,
    setInputFocus,
    selectedSession,
    inputShortBreak,
    inputLongBreak,
    setInputLongBreak,
    setInputShortBreak,
    pomodoroCycles,
    setPomodoroCycles,
  } = useSettingsData();

  const { defineInitialTime } = useTime();
  return (
    <div>
      <label className={`${styles.label} ${styles.mb8}`}>
        Choose timer mode
      </label>
      <div className={styles.chooseTimerMode}>
        <label className={styles.radioBox} htmlFor='pomodoro_timer_mode'>
          <input
            type='radio'
            name='timer_options'
            value='pomodoro_timer_mode'
            defaultChecked={timerMode === "pomodoro_timer_mode"}
            onChange={(e) => {
              setTimerMode(e.target.value);
              localStorage.setItem(
                "timer_mode",
                JSON.stringify(e.target.value)
              );

              setSelectedSession("focus");
              setCurrentSessionIndex(0);
              setSelectedTime(inputFocus * 60);
              setTime(inputFocus * 60);
              setIsTimeUp(false);
            }}
            disabled={isActive || isAlarmPlaying}
            tabIndex={-1}
            id='pomodoro_timer_mode'
          />
          <span
            className={`${styles.radioButton} ${
              isActive && styles.disabledButton
            }`}
            tabIndex={0}
            role='button'
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();

                if (!isActive) {
                  document.getElementById("pomodoro_timer_mode").click();
                }
              }
            }}
          >
            <span></span>
          </span>
          Pomodoro timer
        </label>
        <label className={styles.radioBox} htmlFor='simple_timer_mode'>
          <input
            type='radio'
            name='timer_options'
            value='simple_timer_mode'
            defaultChecked={timerMode === "simple_timer_mode"}
            onChange={(e) => {
              setTimerMode(e.target.value);
              localStorage.setItem(
                "timer_mode",
                JSON.stringify(e.target.value)
              );
              defineInitialTime();
              // console.log(currentAudioRef.current?.paused);
            }}
            disabled={isActive || isAlarmPlaying}
            tabIndex={-1}
            id='simple_timer_mode'
          />
          <span
            className={`${styles.radioButton} ${
              isActive && styles.disabledButton
            }`}
            tabIndex={0}
            role='button'
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();

                if (!isActive) {
                  document.getElementById("simple_timer_mode").click();
                }
              }
            }}
          >
            <span></span>
          </span>
          <span>Simple timer</span>
        </label>
      </div>
      {timerMode === "pomodoro_timer_mode" && (
        <div>
          <label className={`${styles.label} ${styles.mb8}`}>
            Pomodoro Timer Mode
          </label>
          <div>
            <div className={styles.inputs}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Focus (min)</label>
                <input
                  defaultValue={inputFocus}
                  min={1}
                  max={59}
                  type='number'
                  onChange={(e) => {
                    setInputFocus(Number(e.target.value));
                    selectedSession === "focus" && setTime(e.target.value * 60);
                    setSelectedTime(e.target.value * 60);
                  }}
                  disabled={isActive}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Short break</label>
                <input
                  defaultValue={inputShortBreak}
                  min={1}
                  max={59}
                  type='number'
                  onChange={(e) => {
                    setInputShortBreak(Number(e.target.value));
                    selectedSession === "short_break" &&
                      setTime(e.target.value * 60);
                    setSelectedTime(e.target.value * 60);
                  }}
                  disabled={isActive}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Long break</label>
                <input
                  defaultValue={inputLongBreak}
                  min={1}
                  max={59}
                  type='number'
                  onChange={(e) => {
                    setInputLongBreak(Number(e.target.value));
                    selectedSession === "long_break" &&
                      setTime(e.target.value * 60);
                    setSelectedTime(e.target.value * 60);
                  }}
                  disabled={isActive}
                />
              </div>
            </div>
            <p className={styles.seriaSelection}>
              Pomodoro series consists of{" "}
              <select
                id='pomodoroNumber'
                className={styles.pomodoroNumber}
                defaultValue={pomodoroCycles}
                disabled={isActive}
                onChange={(e) => {
                  setPomodoroCycles(Number(e.target.value));
                  setCurrentSessionIndex(0);
                  setSelectedSession("focus");
                }}
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>{" "}
              pomodoros
            </p>
          </div>
        </div>
      )}
      {timerMode === "simple_timer_mode" && (
        <div>
          <label htmlFor='time' className={`${styles.label} ${styles.mb12}`}>
            Simple Timer Mode
          </label>
          <TimeInputForm />
        </div>
      )}
    </div>
  );
}

export default TimerModeSelection;
