import { memo } from "react";
import CircularProgressBar from "./CircularProgressBar";
import CurrentCycleLabel from "./CurrentCycleLabel";
import { useTimerData } from "./PomodoroContext";
import SessionSelector from "./SessionSelector";
import Time from "./Time";
import TimerControl from "./TimerControl";
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
