import { useEffect, useRef } from "react";
import styles from "./CustomConfirmDialog.module.css";

function CustomConfirmDialog({ onConfirm, onCancel, message }) {
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);
  useEffect(function () {
    if (message.includes("all timers")) return cancelBtnRef.current.focus();
    confirmBtnRef.current.focus();
  }, []);
  return (
    <div className={styles.customConfirmDialog}>
      <div className={styles.dialogContent}>
        <p>{message}</p>
        <div className={styles.dialogButtons}>
          <button
            onClick={onConfirm}
            className={styles.confirmButton}
            ref={confirmBtnRef}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className={styles.cancelButton}
            ref={cancelBtnRef}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomConfirmDialog;
