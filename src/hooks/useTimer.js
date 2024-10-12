import { useRef } from "react";
import {
  useNotificationData,
  useSettingsData,
  useTimeData,
  useTimerData,
} from "../components/PomodoroContext";
import { usePomodoroManager } from "./usePomodoroManager";

const useTimer = function () {
  const isActiveRef = useRef(false);

  const {
    isMuted,
    volumeRef,
    pauseSoundRef,
    startSoundRef,
    currentAudioRef,
    allowPauseSound,
    shortSoundTimerRef,
  } = useNotificationData();

  const {
    timeRef,
    setIsActive,
    setIsPaused,
    setIsTimeUp,
    activeRunningTimeRef,
    activeIntervalTimeRef,
    elapsedSecondsRef,
    timerMode,
  } = useTimerData();

  const { pauseTimeRef, time } = useTimeData();

  const { setTime, currentSessionIndex, pomodoroCycles } = useSettingsData();

  const soundQueue = useRef([startSoundRef.current]);

  const { resetPomodoro } = usePomodoroManager();

  function stopSound() {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  }

  function playSound() {
    try {
      clearTimeout(shortSoundTimerRef.current);
      if (isActiveRef.current === false) {
        console.log("The timer is already stopped");
        return;
      }

      stopSound();

      currentAudioRef.current = soundQueue.current[0];
      currentAudioRef.current.volume = isMuted ? 0 : volumeRef.current;

      currentAudioRef.current.play();

      if (soundQueue.current[0].src.includes("start")) {
        // console.log("The timer will stop soon");
        shortSoundTimerRef.current = setTimeout(() => {
          currentAudioRef.current.pause();
          currentAudioRef.current.currentTime = 0;
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing sound:", error);
    }
  }

  async function waitFor(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  function startTimer() {
    isActiveRef.current = true;
    timeRef.current = performance.now();
    activeRunningTimeRef.current = 0;
    setIsActive(true);
    setIsPaused(false);
    setIsTimeUp(false);

    soundQueue.current = [startSoundRef.current];
    playSound(startSoundRef.current);
    // console.log(timerMode);
    timerMode === "pomodoro_timer_mode" &&
      localStorage.setItem(
        "currentSessionIndex",
        JSON.stringify(currentSessionIndex)
      );
    localStorage.setItem("cyclesNumber", JSON.stringify(pomodoroCycles));
  }

  function pauseTimer() {
    if (!isActiveRef.current) {
      console.log("Timer is not active, skipping pause sound");
      return;
    }

    activeRunningTimeRef.current += performance.now() - timeRef.current;

    // console.log(activeRunningTimeRef.current);
    pauseTimeRef.current = performance.now();

    activeIntervalTimeRef.current = performance.now() - timeRef.current;
    // console.log(activeIntervalTimeRef.current);

    stopSound();

    setIsPaused(true);
    soundQueue.current = [pauseSoundRef.current];

    if (!allowPauseSound) return;

    // Make sure for the sound to be ready
    playSound(pauseSoundRef.current);
  }

  function resumeTimer() {
    isActiveRef.current = true;
    timeRef.current = performance.now();
    stopSound();

    soundQueue.current = [startSoundRef.current];

    setIsPaused(false);

    playSound(startSoundRef.current);
  }

  function resetTimer(selectedTime) {
    stopSound();

    soundQueue.current = null;

    setTime(selectedTime);
    setIsActive(false);
    setIsPaused(false);
    setIsTimeUp(false);
    elapsedSecondsRef.current = 0;
    isActiveRef.current = false;

    const passedTime = selectedTime - time;
    resetPomodoro(passedTime);
  }

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    playSound,
    stopSound,
    resetTimer,
    waitFor,
  };
};

export { useTimer };
