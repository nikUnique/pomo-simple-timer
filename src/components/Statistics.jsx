import { memo, useEffect, useRef, useState } from "react";
import {
  FaCoffee,
  FaHammer,
  FaHourglassHalf,
  FaStopwatch,
  FaTrashAlt,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { useKey } from "../hooks/useKey.js";
import { usePomodoroManager } from "../hooks/usePomodoroManager.js";
import { useStatistics } from "../hooks/useStatisctics.js";
import CustomConfirmDialog from "./CustomConfirmDialog";
import { useStatsData, useTimerData } from "./PomodoroContext";
import PomodoroList from "./PomodoroList";
import styles from "./Statistics.module.css";
import TimerTypeSummary from "./TimerTypeSummary";
import CSVGenerator from "./CSVGenerator";

function Statistics({ onCloseModal }) {
  const [showDialog, setShowDialog] = useState("");
  const historyBtnRef = useRef(null);
  const [pomodoroToDelete, setPomodoroToDelete] = useState(null);
  const [selectedPage, setSelectedPage] = useState("history");
  useKey({ key: "escape" }, onCloseModal);

  // console.log("stats");
  // function getLocalStorageSize() {
  //   let total = 0;
  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     const value = localStorage.getItem(key);
  //     total += key.length + value.length;
  //   }
  //   return total;
  // }

  // console.log(`Local Storage Size: ${getLocalStorageSize()} characters`);

  const { pomodoroList } = useStatsData();

  const { isActive } = useTimerData();

  const { toggleEvents } = useStatistics();
  const { deletePomodoro, deleteAllPomodoros } = usePomodoroManager();
  const pomodoroListReverse = pomodoroList.slice().reverse();

  function handleDeleteAllClick() {
    setShowDialog("deleteAllPomodoros");
  }

  function handleConfirmDelete() {
    if (pomodoroToDelete === null) {
      deleteAllPomodoros();
      setShowDialog("");
      return;
    }

    if (pomodoroToDelete >= 0) deletePomodoro(pomodoroToDelete);

    setShowDialog("");

    setPomodoroToDelete(null);
  }

  function handleCancelDelete() {
    setShowDialog("");
    setPomodoroToDelete(null);
  }

  function handleOpenPage(name) {
    setSelectedPage(name);
  }

  return (
    <div>
      <h3 className={styles.statsTitle}>Statistics</h3>
      <div className={styles.statsBorder}></div>
      <div
        className={`${styles.stats}
        
        }`}
      >
        {pomodoroListReverse.length ? (
          <div className={styles.pageSelect}>
            <button
              className={`${styles.sessionBtn} ${
                selectedPage === "history" && styles.sessionBtnActive
              }`}
              onClick={() => handleOpenPage("history")}
              ref={historyBtnRef}
            >
              History
            </button>

            <button
              className={`${styles.sessionBtn} ${
                selectedPage === "summary" && styles.sessionBtnActive
              }`}
              onClick={() => handleOpenPage("summary")}
            >
              Summary
            </button>

            {!isActive && selectedPage === "history" ? (
              <>
                <button
                  onClick={handleDeleteAllClick}
                  className={styles.deleteAllButton}
                >
                  <FaTrashAlt />
                  Delete history
                </button>
                <CSVGenerator />
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {
          <PomodoroList
            toggleEvents={toggleEvents}
            setPomodoroToDelete={setPomodoroToDelete}
            setShowDialog={setShowDialog}
            pomodoroList={pomodoroList}
            selectedPage={selectedPage}
            isActive={isActive}
          />
        }
        {pomodoroListReverse.length ? (
          <div className={styles.summaryContainer}>
            {selectedPage === "summary" && (
              <div className={styles.allTimersSummary}>
                <TimerTypeSummary
                  pomodoroListReverse={pomodoroListReverse}
                  timerType='All'
                  Icon={FaHourglassHalf}
                  label='All timers'
                />

                <TimerTypeSummary
                  pomodoroListReverse={pomodoroListReverse}
                  timerType='Pomodoro'
                  Icon={FaHammer}
                  label='Pomodoro timers'
                />
                <TimerTypeSummary
                  pomodoroListReverse={pomodoroListReverse}
                  timerType='Short'
                  Icon={FaCoffee}
                  label='Short Break timers'
                />
                <TimerTypeSummary
                  pomodoroListReverse={pomodoroListReverse}
                  timerType='Long'
                  Icon={FaUmbrellaBeach}
                  label='Long Break timers'
                />
                <TimerTypeSummary
                  pomodoroListReverse={pomodoroListReverse}
                  timerType='Simple'
                  Icon={FaStopwatch}
                  label='Simple timers'
                />
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>

      {showDialog === "deletePomodoro" && (
        <CustomConfirmDialog
          message='Are you sure you want to delete this timer? This action cannot be undone'
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {showDialog === "deleteAllPomodoros" && (
        <CustomConfirmDialog
          message='Are you sure you want to delete all timers? All timers will start enumeration from 1. This action cannot be undone'
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default memo(Statistics);
