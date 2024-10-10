import { useEffect } from "react";
import { useStatsData, useTimerData } from "../components/PomodoroContext";

function useSetPomodoroCount() {
  const { pomodoroList, setPomodoroCount } = useStatsData();
  const { isTimeUp } = useTimerData();
  useEffect(
    function () {
      // if (isTimeUp === true) {
      const completedPomodoros = pomodoroList.filter(
        (pomodoro) => pomodoro.end
      );
      setPomodoroCount(completedPomodoros.length);

      localStorage.setItem("pomodoroCount", completedPomodoros.length);
      // }
    },
    [isTimeUp, pomodoroList, setPomodoroCount]
  );
}

export { useSetPomodoroCount };
