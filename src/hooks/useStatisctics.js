import { useCallback } from "react";
import { useStatsData } from "../components/PomodoroContext";

export function useStatistics() {
  const { setPomodoroList } = useStatsData();

  const toggleEvents = useCallback(
    (index) => {
      setPomodoroList((prevList) =>
        prevList?.map((pomodoro, i) =>
          i === index
            ? { ...pomodoro, showEvents: !pomodoro.showEvents || false }
            : pomodoro
        )
      );
    },
    [setPomodoroList]
  );

  return { toggleEvents };
}
