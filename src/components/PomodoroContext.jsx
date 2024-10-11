import { createContext, useContext, useMemo, useRef, useState } from "react";

const ModalContext = createContext();
const TimeContext = createContext();
const TimerContext = createContext();
const NotificationContext = createContext();
const SettingsContext = createContext();
const StatsContext = createContext();

export const PomodoroProvider = ({ children }) => {
  // Modal context
  const [openName, setOpenName] = useState("");

  // Time context
  const [time, setTime] = useState(10);
  const correctedStartTimeRef = useRef(null);
  const pauseTimeRef = useRef(null);

  // Timer context
  const [selectedTime, setSelectedTime] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState("pomodoro_timer_mode");
  const timeRef = useRef(null);
  const startTimeRef = useRef(0);
  const activeRunningTimeRef = useRef(0);
  const activeIntervalTimeRef = useRef(0);
  const elapsedSecondsRef = useRef(0);

  // Notification context
  const [isMuted, setIsMuted] = useState(false);
  const [allowPauseSound, setAllowPauseSound] = useState(false);
  const [alarmSound, setAlarmSound] = useState("./end-sound-2.mp3");
  const [alarmIsStopped, setAlarmIsStopped] = useState(true);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const shortSoundTimerRef = useRef(null);
  const currentAudioRef = useRef(null);
  const startSoundRef = useRef(new Audio("./start-sound.mp3"));
  const pauseSoundRef = useRef(new Audio("./pause-sound-2.ogg"));
  const endSoundRef = useRef(new Audio(alarmSound));
  const volumeRef = useRef(0.1);

  // Settings context
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(7);
  const [inputHours, setInputHours] = useState(0);
  const [inputFocus, setInputFocus] = useState(25);
  const [inputShortBreak, setInputShortBreak] = useState(5);
  const [inputLongBreak, setInputLongBreak] = useState(20);
  const [pomodoroCycles, setPomodoroCycles] = useState(4);
  const [selectedSession, setSelectedSession] = useState("focus");
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const preparedEmptyArr = Array.from(
    { length: pomodoroCycles * 2 },
    (_, i) => ""
  );

  function generateNewSessions(el, i, arr) {
    if ((i + 1) % 2 !== 0) return "focus";
    if ((i + 1) % 2 === 0 && arr.length - 1 !== i) return "short_break";
    if ((i + 1) % 2 === 0) return "long_break";
  }

  const generatedSessions = preparedEmptyArr.map(generateNewSessions);

  const [allSessions, setAllSessions] = useState(generatedSessions);

  // Stats context
  const [showStats, setShowStats] = useState(false);
  const [pomodoroList, setPomodoroList] = useState([]);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const simpleTimerIndexesRef = useRef(0);
  const pomodoroTimerIndexesRef = useRef(0);
  const shortBreakTimerIndexesRef = useRef(0);
  const longBreakTimerIndexesRef = useRef(0);

  const timeData = useMemo(
    () => ({
      time,
      correctedStartTimeRef,
      pauseTimeRef,
    }),
    [time]
  );

  const modalData = useMemo(
    () => ({
      openName,
      setOpenName,
    }),
    [openName]
  );

  const timerData = useMemo(
    () => ({
      timerMode,
      setTimerMode,
      selectedTime,
      setSelectedTime,
      isActive,
      setIsActive,
      isPaused,
      setIsPaused,
      isTimeUp,
      setIsTimeUp,
      activeRunningTimeRef,
      activeIntervalTimeRef,
      timeRef,
      startTimeRef,
      elapsedSecondsRef,
    }),
    [timerMode, selectedTime, isActive, isPaused, isTimeUp]
  );

  const notificationData = useMemo(
    () => ({
      isMuted,
      setIsMuted,
      allowPauseSound,
      setAllowPauseSound,
      alarmSound,
      setAlarmSound,
      alarmIsStopped,
      setAlarmIsStopped,
      isAlarmPlaying,
      setIsAlarmPlaying,
      startSoundRef,
      pauseSoundRef,
      endSoundRef,
      volumeRef,
      shortSoundTimerRef,
      currentAudioRef,
    }),
    [isMuted, allowPauseSound, alarmSound, alarmIsStopped, isAlarmPlaying]
  );

  const settingsData = useMemo(
    () => ({
      setTime,
      inputMinutes,
      setInputMinutes,
      inputSeconds,
      setInputSeconds,
      inputHours,
      setInputHours,
      inputFocus,
      setInputFocus,
      inputShortBreak,
      setInputShortBreak,
      inputLongBreak,
      setInputLongBreak,
      pomodoroCycles,
      setPomodoroCycles,
      selectedSession,
      setSelectedSession,
      currentSessionIndex,
      setCurrentSessionIndex,
      allSessions,
      setAllSessions,
    }),
    [
      inputMinutes,
      inputSeconds,
      inputHours,
      inputFocus,
      inputShortBreak,
      inputLongBreak,
      pomodoroCycles,
      selectedSession,
      currentSessionIndex,
      allSessions,
    ]
  );

  const statsData = useMemo(
    () => ({
      pomodoroList,
      setPomodoroList,
      pomodoroCount,
      setPomodoroCount,
      showStats,
      setShowStats,
      simpleTimerIndexesRef,
      pomodoroTimerIndexesRef,
      shortBreakTimerIndexesRef,
      longBreakTimerIndexesRef,
    }),
    [pomodoroList, pomodoroCount, showStats]
  );

  return (
    <ModalContext.Provider value={modalData}>
      <TimeContext.Provider value={timeData}>
        <TimerContext.Provider value={timerData}>
          <NotificationContext.Provider value={notificationData}>
            <SettingsContext.Provider value={settingsData}>
              <StatsContext.Provider value={statsData}>
                {children}
              </StatsContext.Provider>
            </SettingsContext.Provider>
          </NotificationContext.Provider>
        </TimerContext.Provider>
      </TimeContext.Provider>
    </ModalContext.Provider>
  );
};

function useModalData() {
  const context = useContext(ModalContext);
  if (context === undefined)
    throw new Error("Modal Context was used outside of the PomodoroProvider");
  return context;
}

function useTimeData() {
  const context = useContext(TimeContext);
  if (context === undefined)
    throw new Error("Time Context was used outside of the PomodoroProvider");
  return context;
}

function useTimerData() {
  const context = useContext(TimerContext);
  if (context === undefined)
    throw new Error("Timer Context was used outside of the PomodoroProvider");
  return context;
}

function useNotificationData() {
  const context = useContext(NotificationContext);
  if (context === undefined)
    throw new Error(
      "Notification Context was used outside of the PomodoroProvider"
    );
  return context;
}

function useSettingsData() {
  const context = useContext(SettingsContext);
  if (context === undefined)
    throw new Error(
      "Settings Context was used outside of the PomodoroProvider"
    );
  return context;
}

function useStatsData() {
  const context = useContext(StatsContext);
  if (context === undefined)
    throw new Error("Stats Context was used outside of the PomodoroProvider");
  return context;
}

export {
  useModalData,
  useNotificationData,
  useSettingsData,
  useStatsData,
  useTimeData,
  useTimerData,
};
