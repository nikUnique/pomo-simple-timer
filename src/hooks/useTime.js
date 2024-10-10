import { useCallback, useEffect, useMemo } from "react";
import {
  useSettingsData,
  useTimeData,
  useTimerData,
} from "../components/PomodoroContext";

const useTime = () => {
  const { pauseTimeRef } = useTimeData();

  const { setIsTimeUp, setSelectedTime } = useTimerData();

  const { setTime, inputMinutes, inputSeconds, inputHours } = useSettingsData();

  useEffect(
    function () {
      // console.log(inputMinutes, inputHours, inputSeconds);
    },
    [inputMinutes, inputHours, inputSeconds]
  );

  const formatTime = useCallback(function (date, settings) {
    const userLocale = navigator.language || "en-US";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    if (!date) return "In Progress";
    if (settings?.toHourMinSec) return formatToHourMinSec(new Date(date));
    const formattedDate = new Intl.DateTimeFormat(userLocale, options).format(
      new Date(date)
    );
    if (settings?.toLocaleDateString) return formattedDate;
    return formatToLocaleTimeString(new Date(date));
  }, []);

  function formatToHourMinSec(date) {
    const hour = `${date.getHours()}`.padStart(2, "0");
    const min = `${date.getMinutes()}`.padStart(2, "0");
    const sec = `${date.getSeconds()}`.padStart(2, "0");
    return {
      hour,
      min,
      sec,
    };
  }

  function formatToLocaleTimeString(date) {
    return date.toLocaleTimeString();
  }

  const defineInitialTime = useCallback(() => {
    const time =
      Number(inputHours) * 3600 +
      Number(inputMinutes) * 60 +
      Number(inputSeconds);
    if (time < 1) return;

    setTime(time);

    pauseTimeRef.current = 0;
    setSelectedTime(time);
    setIsTimeUp(false);
  }, [
    inputHours,
    inputMinutes,
    inputSeconds,
    pauseTimeRef,
    setIsTimeUp,
    setSelectedTime,
    setTime,
  ]);

  const valueObj = useMemo(
    () => ({
      formatTime,
      defineInitialTime,
    }),
    [formatTime, defineInitialTime]
  );

  return valueObj;
};

export { useTime };
