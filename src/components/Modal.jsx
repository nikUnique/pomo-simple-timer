import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import "simplebar-react/dist/simplebar.min.css";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styles from "./Modal.module.css";
import { useModalData } from "./PomodoroContext";
const ModalContext = createContext();

function Modal({ children }) {
  const { openName, setOpenName } = useModalData();

  const close = useCallback(() => {
    setOpenName("");
  }, [setOpenName]);

  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: () => {
      open(opensWindowName);
    },
  });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const closeBtnRef = useRef(null);

  const shoudlClose = openName === name ? close : false;
  const ref = useOutsideClick(shoudlClose);

  useEffect(
    function () {
      closeBtnRef.current?.focus();
    },
    [openName]
  );

  // if (name !== openName && name !== "stats") return null;

  return createPortal(
    <Overlay openName={openName} name={name}>
      <div
        className={`${name === openName ? styles.modal : styles.hidden}`}
        ref={ref}
      >
        <button
          className={`${styles.closeBtn}`}
          onClick={close}
          ref={closeBtnRef}
        >
          <FaTimes className={styles.icon} />
        </button>

        <div>
          {cloneElement(children, {
            onCloseModal: close,
          })}
        </div>
      </div>
    </Overlay>,
    document.body
  );
}

function Overlay({ children, openName, name }) {
  return (
    <div className={`${openName === name ? styles.overlay : ""}`}>
      {children}
    </div>
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
