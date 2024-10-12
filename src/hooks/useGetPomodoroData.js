import { useEffect } from "react";
import {
  useSettingsData,
  useStatsData,
  useTimeData,
  useTimerData,
} from "../components/PomodoroContext";
import { usePomodoroManager } from "./usePomodoroManager";
import { useTime } from "./useTime";

function useGetPomodoroData() {
  // Getting data from relevant contexts
  const {
    setPomodoroCount,
    setPomodoroList,
    simpleTimerIndexesRef,
    pomodoroTimerIndexesRef,
    shortBreakTimerIndexesRef,
    longBreakTimerIndexesRef,
  } = useStatsData();

  const {
    setTimerMode,
    setIsActive,
    setIsPaused,
    setIsTimeUp,
    setSelectedTime,
    isActive,
    elapsedSecondsRef,
  } = useTimerData();
  const { time } = useTimeData();
  const {
    setTime,
    setInputMinutes,
    setInputSeconds,
    setInputHours,
    setSelectedSession,
    setCurrentSessionIndex,
    inputFocus,
    setPomodoroCycles,
  } = useSettingsData();

  const { updatePomodoroEvents } = usePomodoroManager();

  const { defineInitialTime } = useTime();

  // One huge effect that works only on mount by getting all the data from local storage and setting it where needed
  useEffect(() => {
    let isSessionFinished;
    const savedPomodoroList = localStorage.getItem("pomodoroList");
    if (savedPomodoroList) {
      setPomodoroList(() =>
        JSON.parse(savedPomodoroList).map((pomodoro) => ({
          ...pomodoro,
          start: new Date(pomodoro.start),
          end: pomodoro.end && new Date(pomodoro.end),
          showEvents: false,
        }))
      );
    }
    const updatedPomodoroList = JSON.parse(savedPomodoroList);

    // Checking whether there was active timer running or not, ot the most elegant way of doing so, could be simpler
    !updatedPomodoroList?.at(-1)?.end &&
      !updatedPomodoroList?.at(-1)?.reset &&
      updatedPomodoroList?.length > 0 &&
      updatedPomodoroList?.at(-1).selectedTime <= 60 &&
      setPomodoroList(() => [
        ...updatedPomodoroList.slice(0, -1),
        { ...updatedPomodoroList.at(-1), sessionInterrupted: true },
      ]);

    if (updatedPomodoroList?.length) {
      isSessionFinished =
        updatedPomodoroList?.at(-1)?.end ||
        updatedPomodoroList?.at(-1)?.reset ||
        updatedPomodoroList?.at(-1).selectedTime <= 60;
    }

    if (!updatedPomodoroList?.length) {
      isSessionFinished = true;
    }

    const savedTime = localStorage.getItem("remainingTime");
    const lastTimeSave = localStorage.getItem("lastTimeSave");

    if (savedTime) {
      // console.log(isSessionFinished);
      const storageTime = parseInt(savedTime, 10);
      // This and many other variables will be set from local storage only if the timer was in progress, if it wasn't they won't because it isn't that important to do so if nothing was interrupted
      !isSessionFinished && storageTime > 0 && setTime(storageTime);
      !isSessionFinished &&
        setSelectedTime(updatedPomodoroList?.at(-1)?.selectedTime);

      // This is necessary to keep track of how much time passed since the beginning of the timer untill it was interrupted in case of interrupted timer
      elapsedSecondsRef.current =
        updatedPomodoroList?.at(-1)?.selectedTime - storageTime;
    } else {
      setInputHours(Math.floor(time / 3600));
      setInputMinutes(Math.floor((time % 3600) / 60));
      setInputSeconds(Math.floor(time % 60));
    }

    const savedPomodoroCount = localStorage.getItem("pomodoroCount");
    if (savedPomodoroCount) {
      setPomodoroCount(parseInt(savedPomodoroCount, 10));
    }

    const timerMode = JSON.parse(localStorage.getItem("timer_mode"));
    if (timerMode) {
      // console.log(timerMode);
      // console.log(isSessionFinished);
      setTimerMode(timerMode);
    }

    if (!timerMode) {
      setTimerMode("pomodoro_timer_mode");
    }

    if (
      (timerMode === "pomodoro_timer_mode" || !timerMode) &&
      isSessionFinished
    ) {
      setSelectedTime(inputFocus * 60);
      setTime(inputFocus * 60);
    }

    if (timerMode === "simple_timer_mode" && isSessionFinished) {
      defineInitialTime();
    }

    const nameOfLastItemOnList = updatedPomodoroList?.at(-1)?.timerName;

    if (!nameOfLastItemOnList?.startsWith("Simple") && !isSessionFinished) {
      nameOfLastItemOnList.toLowerCase().startsWith("focus") &&
        setSelectedSession("focus");
      nameOfLastItemOnList.toLowerCase().startsWith("short") &&
        setSelectedSession("short_break");
      nameOfLastItemOnList.toLowerCase().startsWith("long") &&
        setSelectedSession("long_break");
    }

    const currentSessionIndex = JSON.parse(
      localStorage.getItem("currentSessionIndex")
    );

    const cyclesNumber = JSON.parse(localStorage.getItem("cyclesNumber"));

    if (
      currentSessionIndex &&
      (timerMode === "pomodoro_timer_mode" || !timerMode) &&
      !isSessionFinished
    ) {
      setCurrentSessionIndex(currentSessionIndex);
      setPomodoroCycles(cyclesNumber);
    }

    const simpleTimerIndex = localStorage.getItem("simpleTimerIndex");
    if (simpleTimerIndex) {
      simpleTimerIndexesRef.current = JSON.parse(simpleTimerIndex);
    }

    const pomodoroTimerIndex = localStorage.getItem("pomodoroTimerIndex");
    if (pomodoroTimerIndex) {
      pomodoroTimerIndexesRef.current = JSON.parse(pomodoroTimerIndex);
    }

    const shortBreakTimerIndex = localStorage.getItem("shortBreakTimerIndex");
    if (shortBreakTimerIndex) {
      shortBreakTimerIndexesRef.current = JSON.parse(shortBreakTimerIndex);
    }
    const longBreakTimerIndex = localStorage.getItem("longBreakTimerIndex");
    if (longBreakTimerIndex) {
      longBreakTimerIndexesRef.current = JSON.parse(longBreakTimerIndex);
    }

    if (
      !updatedPomodoroList?.at(-1)?.end &&
      !updatedPomodoroList?.at(-1)?.reset &&
      updatedPomodoroList?.length &&
      !isActive &&
      updatedPomodoroList?.at(-1).selectedTime > 60
    ) {
      setIsActive(true);
      setIsPaused(true);
      setIsTimeUp(false);
      updatePomodoroEvents(
        "Interrupted at around" +
          " " +
          new Date(JSON.parse(lastTimeSave)).toLocaleTimeString()
      );

      return;
    }

    elapsedSecondsRef.current = 0;
  }, []);
}

export { useGetPomodoroData };
