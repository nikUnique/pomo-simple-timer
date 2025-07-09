import { memo, useEffect, useMemo, useRef } from "react";
import { FaArrowUp, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import PomodoroSummary from "./PomodoroSummary";
import styles from "./Statistics.module.css";

function PomodoroList({
  toggleEvents,
  setPomodoroToDelete,
  setShowDialog,
  pomodoroList,
  isActive,
  selectedPage,
}) {
  const containerRef = useRef(null);

  const pomodoroListReverse = useMemo(
    () => [...pomodoroList.slice().reverse()],
    [pomodoroList]
  );

  useEffect(
    function () {
      // console.log(pomodoroList, isActive);
    },
    [pomodoroList, isActive]
  );

  function handleDeleteClick(index) {
    setPomodoroToDelete(index);
    setShowDialog("deletePomodoro");
  }

  function getEventClass(event) {
    if (!event) return;
    // console.log(event);
    const lowerEvent = event && event?.toLowerCase();

    if (lowerEvent.includes("start")) return "eventStart";
    if (lowerEvent.includes("pause")) return "eventPause";
    if (lowerEvent.includes("resume")) return "eventResume";
    if (lowerEvent.includes("reset")) return "eventReset";
  }

  function getPomodoroItemClass(session) {
    let className;
    if (session?.reset) return (className = "reset");
    if (session?.end) return (className = "completed");
    return (className = "incomplete");
  }

  // The problem is that the difference is always less then 24 hours, I should also to compare dates
  function differenceInDays(currentDate, previousDate) {
    const areDatesDifferent =
      new Date(currentDate).getDate() !== new Date(previousDate).getDate() &&
      previousDate;
    return areDatesDifferent;
    // const msPerDay = 24 * 60 * 60 * 1000;
    // const differenceInDays =
    //   (new Date(currentDate) - new Date(previousDate)) / msPerDay;
    // console.log(currentDate, previousDate, "superDates");
    // console.log(differenceInDays);

    // if (Math.floor(differenceInDays) === 1) {
    //   return 1;
    // }
    // if (Math.floor(differenceInDays) < 1) {
    //   return 0;
    // }
    // if (Math.floor(differenceInDays) > 1) {
    //   return Math.floor(differenceInDays);
    // }

    // const differenceInYear =
    //   new Date(currentDate).getFullYear() - new Date(previousDate).getFullYear();
    // const differenceInMonth =
    //   new Date(currentDate).getMonth() - new Date(previousDate).getMonth();

    // const differenceInDays =
    //   new Date(currentDate).getDate() - new Date(previousDate).getDate();

    // Know the difference
    // Keep track of whether it is the same month or not, the same year or not and I need to add days of the new month, year to the previous month, year
    // How to understand how much time has gone already?
    // For this exact case all I need to know that there is a difference and not how much the difference is

    // return dayDifference;
  }

  // pomodoroListReverse.map((day, i) =>
  //   console.log(differenceInDays(day.start, pomodoroListReverse[i + 1]?.start))
  // );

  return (
    <>
      <SimpleBar
        className={`${pomodoroListReverse.length ? styles.simpleBar : ""} ${
          selectedPage === "history" ? "" : styles.hidden
        }`}
      >
        <ul
          className={`${pomodoroListReverse.length ? "" : styles.empty} 
        }`}
          ref={containerRef}
        >
          {pomodoroListReverse.length
            ? pomodoroListReverse?.map((session, index, arr) => (
                <>
                  <li
                    key={index}
                    className={`${styles[getPomodoroItemClass(session)]} ${
                      session.sessionInterrupted && styles.sessionInterrupted
                    }`}
                  >
                    <div className={styles.pomodoroItem}>
                      {!session?.showEvents && (
                        <>
                          <PomodoroSummary session={session} />
                        </>
                      )}
                      <div className={styles.pomodoroBtnsContainer}>
                        {!session?.showEvents && !isActive && (
                          <button
                            onClick={() => {
                              // Passing the index of the actuall pomodoro list item that hasn't been reversed so that items match as the they will be deleted from pomodoro list and not from reversedPomodoroList on which I call the method
                              handleDeleteClick(arr.length - index - 1);
                            }}
                            className={styles.deleteButton}
                          >
                            <FaTrash />
                          </button>
                        )}

                        {session?.showEvents && (
                          <p className={styles.pomodoroNumberTitle}>
                            {" "}
                            {session.timerName}
                            &nbsp;&bull;&nbsp;timer events
                          </p>
                        )}
                      </div>
                    </div>

                    {session?.showEvents && (
                      <div className={styles.eventsContainer}>
                        {session.events?.length ? (
                          session?.events?.map((event, i) => {
                            return (
                              <div
                                key={i}
                                className={`${styles.eventItem} ${
                                  styles[getEventClass(event)]
                                }`}
                              >
                                {event}
                              </div>
                            );
                          })
                        ) : (
                          <div className={styles.eventItem}>
                            There were no pause/resume events
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => toggleEvents(arr.length - index - 1)}
                      className={styles.toggleEvents}
                    >
                      {session?.showEvents ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </li>
                  {differenceInDays(
                    session?.start,
                    arr.at(index + 1)?.start
                  ) && (
                    <p
                      className={
                        index === arr.length - 1
                          ? styles.firstDate
                          : styles.date
                      }
                    >
                      <FaArrowUp className={styles.arrowUp}></FaArrowUp>
                      {`  ${new Date(session.start).toLocaleDateString(
                        navigator.language,
                        {
                          day: "numeric",
                          month: "long",
                          year: "2-digit",
                        }
                      )}`}
                    </p>
                  )}

                  {index === arr.length - 1 && (
                    <p
                      className={
                        index === arr.length - 1
                          ? styles.firstDate
                          : styles.date
                      }
                    >
                      <FaArrowUp className={styles.arrowUp}></FaArrowUp>
                      {`  ${new Date(session.start).toLocaleDateString(
                        navigator.language,
                        {
                          day: "numeric",
                          month: "long",
                          year: "2-digit",
                        }
                      )}`}
                    </p>
                  )}
                </>
              ))
            : ""}
        </ul>
      </SimpleBar>

      {pomodoroListReverse.length === 0 && (
        <div className={styles.statisticsPlaceholder}>
          <p className={styles.statisticsPlaceholderText}>
            {" "}
            No Pomodoros on the list yet. Start your first session to see your
            progress here!
          </p>
          <img src='./clipboard-5.webp' className={styles.clipboard} />
        </div>
      )}
    </>
  );
}

export default memo(PomodoroList);
