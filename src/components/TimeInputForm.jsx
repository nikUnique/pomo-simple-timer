import { useRef, useState } from "react";
import { useTime } from "../hooks/useTime.js";
import { useSettingsData, useTimerData } from "./PomodoroContext";
import styles from "./TimeInputForm.module.css";

function TimeInputForm() {
  const { isActive, isPaused } = useTimerData();
  const {
    inputMinutes,
    inputSeconds,
    inputHours,
    setInputMinutes,
    setInputSeconds,
    setInputHours,
  } = useSettingsData();

  const [disabledButton, setDisabledButton] = useState(false);

  const setButtonRef = useRef(null);

  const { defineInitialTime } = useTime();

  function handleSetTime() {
    // setElapsedTime(
    //   (prevElapsedTime) => prevElapsedTime + (selectedTime - time)
    // );
    defineInitialTime();
    setDisabledButton(true);

    setButtonRef.current.textContent = "Time is set";
  }
  function constructHoursLabel(e, timeUnit) {
    if (timeUnit === "hours" && Number(e.target.value) > 0) {
      return e.target.value.slice(0, 3) + " : ";
    }

    if (timeUnit === "hours" && Number(e.target.value) === 0) {
      return "";
    }

    if (timeUnit !== "hours" && inputHours === 0) {
      return "";
    }

    if (timeUnit !== "hours" && inputHours > 0) {
      return inputHours + " : ";
    }

    // Crazy equalent
    /*  e.target.value > 0
        ? String(
            timeUnit === "hours"
              ? e.target.value + " : "
              : timeUnit === "hours"
              ? inputHours + " : "
              : ""
          )
        : ""  */
  }

  function changeInputTime(e, timeUnit) {
    setDisabledButton(false);
    if (e.target.value.length > 2 && timeUnit !== "hours")
      e.target.value = e.target.value.slice(0, 2);

    if (e.target.value.length >= 3 && timeUnit === "hours") {
      e.target.value = e.target.value.slice(0, 3);
    }

    if (e.target.value > 59 && timeUnit !== "hours") e.target.value = 59;

    setButtonRef.current.textContent = `Set Time (${constructHoursLabel(
      e,
      timeUnit
    )}${String(
      timeUnit === "minutes" ? e.target.value.slice(0, 2) : inputMinutes
    ).padStart(2, 0)} : ${String(
      timeUnit === "seconds" ? e.target.value.slice(0, 2) : inputSeconds
    ).padStart(2, 0)}) `;
  }

  return (
    <div>
      <div className={styles.inputs}>
        <div className={styles.formGroup}>
          <label>Hours</label>
          <input
            defaultValue={inputHours}
            min={0}
            max={1000}
            type='number'
            onChange={(e) => {
              setInputHours(Number(e.target.value.slice(0, 3)));
              changeInputTime(e, "hours");
            }}
            id='time'
            disabled={isActive && !isPaused}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Minutes</label>
          <input
            defaultValue={inputMinutes}
            min={0}
            max={59}
            maxLength='2'
            type='number'
            onChange={(e) => {
              setInputMinutes(Number(e.target.value));
              changeInputTime(e, "minutes");
            }}
            id='time'
            disabled={isActive && !isPaused}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Seconds</label>
          <input
            type='number'
            defaultValue={inputSeconds}
            min={0}
            max={59}
            onChange={(e) => {
              setInputSeconds(Number(e.target.value));
              changeInputTime(e, "seconds");
            }}
            disabled={isActive && !isPaused}
          />
        </div>
      </div>

      <div className={isActive && !isPaused && styles.setTimeIsDisabled}>
        <button
          onClick={handleSetTime}
          className={styles.inputsButton}
          disabled={
            (isActive && !isPaused) ||
            (inputMinutes === 0 && inputSeconds === 0 && inputHours === 0) ||
            disabledButton
          }
          ref={setButtonRef}
        >
          Set Time (
          <span className={inputHours > 0 ? "" : styles.hiddenHours}>
            {inputHours > 0 ? inputHours + " : " : ""}
          </span>
          <span>
            {String(inputMinutes > 0 ? inputMinutes : 0).padStart(2, 0)}
          </span>
          &nbsp;:&nbsp;
          <span>{String(inputSeconds).padStart(2, 0)})</span>
        </button>
      </div>
    </div>
  );
}

export default TimeInputForm;
