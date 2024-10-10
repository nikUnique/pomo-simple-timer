import { useEffect, useState } from "react";
import {
  useSettingsData,
  useStatsData,
  useTimerData,
} from "../components/PomodoroContext";

const usePomodoroManager = function () {
  const {
    setPomodoroList,
    pomodoroList,
    setPomodoroCount,
    simpleTimerIndexesRef,
    pomodoroTimerIndexesRef,
    shortBreakTimerIndexesRef,
    longBreakTimerIndexesRef,
  } = useStatsData();
  const { selectedTime, timerMode } = useTimerData();
  const { selectedSession } = useSettingsData();
  const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(true);

  useEffect(
    function () {
      if (isInitiallyLoaded) {
        return setIsInitiallyLoaded(false);
      }
      localStorage.setItem("pomodoroList", JSON.stringify(pomodoroList));

      if (timerMode === "simple_timer_mode") {
        localStorage.setItem(
          "simpleTimerIndex",
          JSON.stringify(simpleTimerIndexesRef.current)
        );
      }

      if (timerMode === "pomodoro_timer_mode") {
        selectedSession === "focus" &&
          localStorage.setItem(
            "pomodoroTimerIndex",
            JSON.stringify(pomodoroTimerIndexesRef.current)
          );
        selectedSession === "short_break" &&
          localStorage.setItem(
            "shortBreakTimerIndex",
            JSON.stringify(shortBreakTimerIndexesRef.current)
          );
        selectedSession === "long_break" &&
          localStorage.setItem(
            "longBreakTimerIndex",
            JSON.stringify(longBreakTimerIndexesRef.current)
          );
      }
    },
    [
      pomodoroList,
      isInitiallyLoaded,
      simpleTimerIndexesRef,
      pomodoroTimerIndexesRef,
      shortBreakTimerIndexesRef,
      longBreakTimerIndexesRef,
      timerMode,
      selectedSession,
    ]
  );

  function addPomodoroItem(startTime) {
    // console.log(selectedSession);
    // console.log(timerMode);
    let newTimerName;
    if (timerMode === "simple_timer_mode") {
      simpleTimerIndexesRef.current += 1;
      // console.log(simpleTimerIndexesRef.current);

      newTimerName = `Simple timer #${String(
        simpleTimerIndexesRef.current
      ).padStart(2, "0")}`;
    }

    if (timerMode === "pomodoro_timer_mode") {
      if (selectedSession === "focus") {
        pomodoroTimerIndexesRef.current += 1;
        newTimerName = `Pomodoro #${String(
          pomodoroTimerIndexesRef.current
        ).padStart(2, "0")}`;
      }
      if (selectedSession === "short_break") {
        shortBreakTimerIndexesRef.current += 1;
        newTimerName = `Short break #${String(
          shortBreakTimerIndexesRef.current
        ).padStart(2, "0")}`;
      }
      if (selectedSession === "long_break") {
        longBreakTimerIndexesRef.current += 1;
        newTimerName = `Long break #${String(
          longBreakTimerIndexesRef.current
        ).padStart(2, "0")}`;
      }
    }

    setPomodoroList((prevList) => {
      const newList = [
        ...prevList,
        {
          start: new Date(startTime),
          end: null,
          showEvents: false,
          events: [],
          selectedTime,
          timerName: newTimerName,
        },

        // {
        //   start: yesterday.setDate(today.getDate() + 4),
        //   end: new Date(),
        //   showEvents: false,
        //   events: ["Started at " + new Date().toLocaleTimeString()],
        // },
      ];

      return newList;
    });
  }

  function updatePomodoroEndTime(finishedTime) {
    setPomodoroList((prevList) => {
      if (prevList.length === 0) return prevList;

      const newList = prevList.map((item, index) =>
        index === prevList.length - 1
          ? {
              ...item,
              end: new Date(finishedTime),
              duration:
                item.selectedTime -
                JSON.parse(localStorage.getItem("remainingTime")),
            }
          : item
      );

      return newList;
    });
  }

  function resetPomodoro(elapsedTime) {
    setPomodoroList((prevList) => {
      if (prevList.length === 0) return prevList;
      if (pomodoroList.at(-1).events?.at(-1)?.startsWith("Reset at")) return;

      const newList = prevList.map((item, index) =>
        index === prevList.length - 1
          ? {
              ...item,
              reset: true,
              events: [...item.events],
              resetTime: new Date().toLocaleString(),
              resetDate: new Date().toLocaleDateString(),
              duration: elapsedTime,
            }
          : item
      );

      return newList;
    });
  }

  const deletePomodoro = (index) => {
    if (index < 0 || index >= pomodoroList.length) return;
    const newList = [...pomodoroList];
    newList.splice(index, 1);
    setPomodoroList(newList);
    if (newList.length === 0 && timerMode === "simple_timer_mode")
      simpleTimerIndexesRef.current = 0;

    if (timerMode === "pomodoro_timer_mode" && newList.length === 0) {
      pomodoroTimerIndexesRef.current = 0;

      shortBreakTimerIndexesRef.current = 0;

      longBreakTimerIndexesRef.current = 0;
    }
  };

  function deleteAllPomodoros() {
    if (timerMode === "simple_timer_mode") {
      simpleTimerIndexesRef.current = 0;
    }

    if (timerMode === "pomodoro_timer_mode") {
      pomodoroTimerIndexesRef.current = 0;

      shortBreakTimerIndexesRef.current = 0;

      longBreakTimerIndexesRef.current = 0;
    }
    setPomodoroList([]);
    setPomodoroCount(0);
    localStorage.setItem("pomodoroCount", JSON.stringify(0));
  }

  const updatePomodoroEvents = (event) => {
    setPomodoroList((prevList) => {
      const updatedList = prevList.map((pomodoro, i) =>
        i === prevList.length - 1
          ? {
              ...pomodoro,
              events: [...pomodoro.events, event],
            }
          : pomodoro
      );
      return updatedList;
    });
  };
  return {
    updatePomodoroEvents,
    addPomodoroItem,
    updatePomodoroEndTime,
    resetPomodoro,
    deletePomodoro,
    deleteAllPomodoros,
  };
};

export { usePomodoroManager };
