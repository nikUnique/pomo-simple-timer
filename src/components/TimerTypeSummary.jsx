import { FaCheckCircle, FaClock } from "react-icons/fa";
import styles from "./TimerTypeSummary.module.css";

function TimerTypeSummary({ pomodoroListReverse, timerType, Icon, label }) {
  function totalTimeMin(timerKind) {
    const filteredTimers = pomodoroListReverse.filter((timer) => {
      if (timerKind === "All" && timer.end) return timer;
      if (timer.end && timer.timerName.startsWith(timerKind)) return timer;
    });

    const totalTimeSec = filteredTimers.reduce((acc, timer) => {
      return acc + timer.selectedTime;
    }, 0);

    const totalTimeMin = totalTimeSec / 60;

    return totalTimeMin;
  }

  const totalTimersCompleted = pomodoroListReverse.filter((timer) => {
    if (timerType === "All" && timer.end) return timer;
    return timer.timerName.startsWith(timerType) && timer.end;
  }).length;

  return (
    <div className={styles.summaryItem}>
      <p className={styles.summaryLabel}>
        <Icon className={styles.summaryIcon} /> {label}
      </p>
      <p className={styles.summaryPoint}>
        <FaCheckCircle className={styles.summaryIcon} />
        {pomodoroListReverse.length > 0 ? (
          <span className={styles.totalCompletedTitle}>
            Total completed:&nbsp;<strong>{totalTimersCompleted}</strong>
          </span>
        ) : (
          ""
        )}
      </p>
      <p className={styles.summaryPoint}>
        <FaClock className={styles.summaryIcon} />
        <span className={styles.totalTime}>
          Total time:&nbsp;
          {totalTimeMin(timerType) ? (
            <>
              <strong>
                {totalTimeMin(timerType) >= 1
                  ? Math.floor(totalTimeMin(timerType))
                  : totalTimeMin(timerType) * 60}
              </strong>
              &nbsp;{totalTimeMin(timerType) >= 1 ? "minutes" : "seconds"}
            </>
          ) : (
            "No data"
          )}
        </span>
      </p>
    </div>
  );
}

export default TimerTypeSummary;
