import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaHourglass,
  FaPlay,
  FaRedo,
} from "react-icons/fa";
import { useTime } from "../hooks/useTime.js";
import styles from "./PomodoroSummary.module.css";
import { memo } from "react";

function PomodoroSummary({ session }) {
  const { formatTime } = useTime();

  const isSameDay =
    (session.start || session.end) &&
    new Date(session.start).getDate() ===
      new Date(session.end || session.resetDate).getDate();

  function formattedTime(timeString, options) {
    const { hour, min, sec } = formatTime(new Date(timeString), options);

    return (
      <p className={styles.timeBox}>
        <span>{hour}</span>
        <span>:</span>
        <span>{min}</span>

        {session.selectedTime % 60 !== 0 && (
          <>
            {" "}
            <span>:</span>
            <span>{sec}</span>
          </>
        )}
      </p>
    );
  }

  const startSummary = (
    <>
      <p>
        {session.timerName}
        {/* <strong>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </strong> */}
      </p>
      &nbsp;&bull;&nbsp;
      <span className={styles.summary}>
        <FaPlay />
        Start:&nbsp;
      </span>
      <span className={styles.timeBox}>
        {formattedTime(session.start, { toHourMinSec: true })}
      </span>
    </>
  );

  function constructDurationLabel() {
    const hours = Math.floor(session.duration / 3600);
    const minutes = Math.floor((session.duration % 3600) / 60);
    const secs = session.duration % 60;

    const formattedHours =
      hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return (
      <>
        &nbsp;&bull;&nbsp;
        <p className={styles.summary}>
          <FaClock /> Duration:
          <span className={styles.timeBox}>
            <span>{formattedHours}</span>
            <span>{formattedMinutes}</span>
            <span>:</span>
            <span>{formattedSeconds}</span>
          </span>
        </p>
      </>
    );
  }

  const resetLabel = (
    <span className={styles.summary}>
      <FaRedo />
      <span className={styles.resetLabel}>Reset:&nbsp;</span>
    </span>
  );

  // if (!isSameDay && (session.end || session.reset)) {
  //   return (
  //     <div className={styles.fullSummary}>
  //       {startSummary}
  //       &nbsp;&bull;&nbsp;
  //       {session.reset ? (
  //         resetLabel
  //       ) : (
  //         <span className={styles.summary}>
  //           <FaCheckCircle />
  //           Finish:
  //         </span>
  //       )}
  //       &nbsp;
  //       {formattedTime(session.reset ? session.resetTime : session.end, {
  //         toHourMinSec: true,
  //       })}
  //       {constructDurationLabel()}
  //     </div>
  //   );
  // }

  if (session.end) {
    return (
      <div className={styles.fullSummary}>
        <p className={styles.firstPart}>
          {startSummary}
          &nbsp;&bull;&nbsp;
          <span className={`${styles.summary}`}>
            <FaCheckCircle />
            <span className={styles.finishLabel}> Finish:&nbsp;</span>
          </span>
        </p>
        <span className={styles.timeBox}>
          {formattedTime(session.end, { toHourMinSec: true })}
        </span>
        {constructDurationLabel()}
      </div>
    );
  }

  if (session.reset) {
    return (
      <div className={styles.fullSummary}>
        {startSummary}
        &nbsp;&bull;&nbsp;
        {resetLabel}
        {formattedTime(session.resetTime, {
          toHourMinSec: true,
        })}
        {constructDurationLabel()}
      </div>
    );
  }

  if (session.sessionInterrupted) {
    return (
      <div className={styles.fullSummary}>
        {startSummary}
        &nbsp;&bull;&nbsp;
        <span className={`${styles.summary} `}>
          <FaExclamationTriangle />
          Session interrupted before completion
        </span>{" "}
      </div>
    );
  }

  return (
    <div className={styles.fullSummary}>
      {startSummary}
      &nbsp;&bull;&nbsp;
      <span className={styles.summary}>
        <FaHourglass />
        In Progress
      </span>{" "}
    </div>
  );
}

export default memo(PomodoroSummary);
