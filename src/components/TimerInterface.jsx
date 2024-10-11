import { memo } from "react";
import CircularProgressBar from "./CircularProgressBar.jsx";
import CurrentCycleLabel from "./CurrentCycleLabel.jsx";
import { useTimerData } from "./PomodoroContext.jsx";
import SessionSelector from "./SessionSelector.jsx";
import Time from "./Time.jsx";
import TimerControl from "./TimerControl.jsx";
import styles from "./TimerInterface.module.css";

function TimerInterface() {
  const { timerMode } = useTimerData();

  return (
    <div className={styles.timerIntBox}>
      <div className={styles.timerContainer}>
        {timerMode === "pomodoro_timer_mode" && <SessionSelector />}
        <CircularProgressBar size={36} strokeWidth={3}>
          <Time />
          {timerMode === "pomodoro_timer_mode" && <CurrentCycleLabel />}
        </CircularProgressBar>
        {<TimerControl />}
      </div>
    </div>
  );
}

export default memo(TimerInterface);
