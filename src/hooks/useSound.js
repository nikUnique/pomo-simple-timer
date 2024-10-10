import { useCallback, useEffect, useRef } from "react";
import CurrentCycleLabel from "../components/CurrentCycleLabel";
import {
  useNotificationData,
  useSettingsData,
  useTimeData,
  useTimerData,
} from "../components/PomodoroContext";
import { usePomodoroManager } from "../hooks/usePomodoroManager";
import { useTimer } from "../hooks/useTimer";
function useSound() {
  const { correctedStartTimeRef, time } = useTimeData();

  const {
    timerMode,
    setIsTimeUp,
    setIsActive,
    isActive,
    isPaused,
    selectedTime,
    activeIntervalTimeRef,
    startTimeRef,
    elapsedSecondsRef,
  } = useTimerData();
  const {
    volumeRef,
    isMuted,
    endSoundRef,
    currentAudioRef,
    shortSoundTimerRef,
    setAlarmIsStopped,
    setIsAlarmPlaying,
  } = useNotificationData();
  const { setTime } = useSettingsData();

  const { updatePomodoroEndTime } = usePomodoroManager();

  const timeoutRef = useRef(null);
  const correctionIntervalId = useRef(null);

  const { stopSound } = useTimer();

  const updateInterval = 100;

  // What to do when the timer was update?
  // It appears that startTimeRef contains the amount of time that already passed, therefore when I try to adjust the timer, it still has the passed time and just subracts it from the selected time, what to do? I need a way where after adjusting the time the value that gets subracted from now is zero

  const handleTimerEnd = useCallback(
    function () {
      setIsActive(false);
      setIsTimeUp(true);
      setTime(0);
      setAlarmIsStopped(false);
      setIsAlarmPlaying(true);

      localStorage.setItem("remainingTime", JSON.stringify(0));

      activeIntervalTimeRef.current = null;
      elapsedSecondsRef.current = 0;

      clearTimeout(shortSoundTimerRef.current);
      clearInterval(correctionIntervalId.current);

      stopSound();

      currentAudioRef.current = endSoundRef.current;
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.volume = isMuted ? 0 : volumeRef.current;
      currentAudioRef.current.play();

      setTimeout(() => {
        if (timerMode === "pomodoro_timer_mode") {
          CurrentCycleLabel.handleNextSessionClick();
        }
        setAlarmIsStopped(true);
        setIsAlarmPlaying(false);
        if (timerMode === "simple_timer_mode") {
          setTime(selectedTime);
        }
        stopSound();
      }, 5000);
    },
    [
      currentAudioRef,
      isMuted,
      endSoundRef,
      activeIntervalTimeRef,
      selectedTime,
      setIsActive,
      setAlarmIsStopped,
      setIsTimeUp,
      setTime,
      shortSoundTimerRef,
      stopSound,
      timerMode,
      volumeRef,
      setIsAlarmPlaying,
      elapsedSecondsRef,
    ]
  );

  const updateTimer = useCallback(
    function () {
      if (!isActive || isPaused) return;
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const elapsedSeconds = Math.floor(elapsed / 1000);

      // console.log(elapsedSeconds);
      const remainingTime = Math.floor(
        selectedTime - elapsedSecondsRef.current - elapsedSeconds,
        0
      );
      // console.log(remainingTime);
      // console.log(elapsedSecondsRef.current);
      setTime(remainingTime);

      if (elapsedSeconds + elapsedSecondsRef.current >= selectedTime) {
        const finishTime = performance.timeOrigin + performance.now();

        let correctedFinishTime =
          Number(String(finishTime).slice(-3)) >= 900 &&
          String(correctedStartTimeRef.current).slice(-3) === "000"
            ? Math.ceil(Number(finishTime) / 1000) * 1000
            : finishTime;

        // console.log(correctedFinishTime);

        updatePomodoroEndTime(correctedFinishTime);

        handleTimerEnd();
        return;
      }

      timeoutRef.current = setTimeout(updateTimer, updateInterval);
      if (remainingTime % 60 === 0) {
        localStorage.setItem("remainingTime", JSON.stringify(time));
        localStorage.setItem("lastTimeSave", JSON.stringify(Date.now()));
      }
    },
    [
      correctedStartTimeRef,
      isActive,
      isPaused,
      selectedTime,
      startTimeRef,
      setTime,
      time,
      handleTimerEnd,
      updatePomodoroEndTime,
      elapsedSecondsRef,
    ]
  );

  useEffect(
    function () {
      if (isActive && !isPaused) {
        updateTimer();

        return () => {
          clearTimeout(timeoutRef.current);
        };
      } else {
        clearTimeout(timeoutRef.current);
      }
    },
    [
      isActive,
      isPaused,
      setTime,
      selectedTime,
      startTimeRef,
      time,
      correctionIntervalId,
      correctedStartTimeRef,
      updateTimer,
    ]
  );
}

export { useSound };
