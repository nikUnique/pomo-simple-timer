import { useEffect, useRef } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useTimer } from "../hooks/useTimer.js";
import { useNotificationData, useTimerData } from "./PomodoroContext";
import styles from "./Settings.module.css";
import TimerModeSelection from "./TimerModeSelection";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useKey } from "../hooks/useKey.js";
const alarmSounds = [
  { name: "Ring One", url: "/end-sound-2.mp3" },
  { name: "Ring Two", url: "/end-sound-3.mp3" },
  { name: "Ring Three", url: "/end-sound-4.mp3" },
];

function Settings({ onCloseModal }) {
  const {
    alarmSound,
    setAlarmSound,
    isMuted,
    setIsMuted,
    volumeRef,
    startSoundRef,
    currentAudioRef,
    allowPauseSound,
    setAllowPauseSound,
    endSoundRef,
  } = useNotificationData();

  useEffect(
    function () {
      endSoundRef.current = new Audio(alarmSound);
    },
    [alarmSound, endSoundRef]
  );

  const { timerMode, isActive } = useTimerData();

  // console.log(timerMode);

  const { stopSound } = useTimer();
  const isDebouncing = useRef(false);
  const soundQueue = useRef([startSoundRef.current]);
  useKey({ key: "escape" }, onCloseModal);

  function checkCurrentTime(e) {
    if (e.target.currentTime >= 3) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      isDebouncing.current = false;
    }
  }

  function handleSoundChange(e) {
    stopSound();

    setAlarmSound(e.target.value);
    soundQueue.current = [e.target.value];

    if (isDebouncing.current) {
      console.log("The sound line is busy");
      return;
    }

    isDebouncing.current = true;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    currentAudioRef.current = new Audio(soundQueue.current[0]);
    currentAudioRef.current.volume = isMuted ? 0 : volumeRef.current;

    currentAudioRef.current.play();

    currentAudioRef.current.addEventListener("timeupdate", checkCurrentTime);

    isDebouncing.current = false;
  }

  function handleVolumeChange(e) {
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = isMuted ? 0 : e.target.value;
      volumeRef.current = e.target.value;
    }
  }

  function handleStopVolumeInteraction(e) {
    stopSound();
    if (currentAudioRef.current) {
      currentAudioRef.current.removeEventListener(
        "timeupdate",
        checkCurrentTime
      );
    }

    currentAudioRef.current = new Audio(alarmSound);

    if (currentAudioRef.current) {
      currentAudioRef.current.volume = isMuted ? 0 : e.target.value;
      volumeRef.current = e.target.value;
      currentAudioRef.current.play();
      currentAudioRef.current.addEventListener("timeupdate", checkCurrentTime);
    }
  }

  function toggleMute() {
    if (!currentAudioRef.current)
      currentAudioRef.current = startSoundRef.current;
    if (currentAudioRef.current) {
      if (!isMuted) {
        currentAudioRef.current.volume = 0;
        setIsMuted(true);
      } else {
        currentAudioRef.current.volume = volumeRef.current;

        setIsMuted(false);
      }
    }
  }

  function handleAllowPauseSound() {
    setAllowPauseSound((cur) => !cur);
  }

  return (
    <div>
      {
        <>
          <h3 className={styles.settingsTitle}>Settings</h3>
          <div className={styles.settingsBorder}></div>
          <SimpleBar className={styles.simpleBar}>
            <div className={styles.settingsMenu}>
              <div className={styles.settingsContainer}>
                <label
                  htmlFor='label'
                  className={`${styles.label} ${styles.noTopBorder} ${styles.topLabel} ${styles.mb12}  `}
                >
                  Choose Alarm Sound
                </label>

                <select
                  value={alarmSound}
                  id='label'
                  onChange={handleSoundChange}
                  className={styles.soundSelect}
                  disabled={isActive}
                >
                  {alarmSounds.map((sound) => (
                    <option key={sound.name} value={sound.url}>
                      {sound.name}
                    </option>
                  ))}
                </select>
                <div className={styles.volumeControl}>
                  <label
                    htmlFor='volume'
                    className={`${styles.label} ${styles.mb4}`}
                  >
                    Volume
                  </label>
                  <div className={styles.volumeBox}>
                    <input
                      type='range'
                      id='volume'
                      defaultValue={volumeRef.current}
                      min='0'
                      max='1'
                      step='0.01'
                      onChange={handleVolumeChange}
                      onMouseUp={
                        !isActive
                          ? handleStopVolumeInteraction
                          : handleVolumeChange
                      }
                      className={styles.volumeSlider}
                    />
                    <button onClick={toggleMute} className={styles.muteButton}>
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                  </div>
                </div>
                <TimerModeSelection />

                <label className={`${styles.label} ${styles.mb8}`}>
                  Other settings
                </label>
                <div className={styles.enableSoundBox}>
                  <label className={styles.customCheckbox}>
                    <input
                      type='checkbox'
                      className={styles.checkboxInput}
                      checked={allowPauseSound}
                      value={allowPauseSound}
                      onChange={handleAllowPauseSound}
                    />
                    <span className={styles.checkmark}></span>
                    <span htmlFor='toggle-play'>Play sound during pause</span>
                  </label>
                </div>
              </div>
            </div>
          </SimpleBar>
          <div className={styles.bottomBorder}></div>
        </>
      }
    </div>
  );
}

export default Settings;
