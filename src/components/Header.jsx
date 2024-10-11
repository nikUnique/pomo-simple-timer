import { useRef } from "react";
import { FaChartBar, FaCog, FaKeyboard } from "react-icons/fa";
import { useKey } from "../hooks/useKey";
import styles from "./Header.module.css";
import KeyboardShortcuts from "./KeyboardShortcuts";
import Modal from "./Modal";
import Settings from "./Settings";
import Statistics from "./Statistics";

function Header() {
  const openSettingsRef = useRef(null);
  const openStatsRef = useRef(null);
  const openShortcutsRef = useRef(null);

  function openSettings() {
    openSettingsRef.current?.click();
  }
  function openStats() {
    openStatsRef.current?.click();
  }
  function openShortcuts() {
    openShortcutsRef.current?.click();
  }

  // useHotkeys("ctrl+comma", openSettings);
  // useHotkeys("ctrl+shift+comma", openSettings);
  useKey({ shift: true, key: "comma" }, openSettings);
  useKey({ shift: true, key: "keys" }, openStats);
  useKey({ ctrl: true, key: "slash" }, openShortcuts);

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <div className={styles.appTitle}>
          <img
            src='./icon.svg'
            alt='Pomodoro icon'
            className={styles.headerIcon}
          />
          <h1 className={styles.mainTitle}>PomoSimple Timer</h1>
          {/* <div className={styles.simpleTimer}>
            <p className={styles.mainTitleExtension}>
              ... or just a simple timer{" "}
            </p>
            <img
              src='/timer-clock.svg'
              alt='Timer clock'
              className={styles.timerIcon}
            />
          </div> */}
        </div>
        <nav className={styles.appNav}>
          <Modal>
            <Modal.Open opens='stats'>
              <button className={styles.toggleStatsButton} ref={openStatsRef}>
                <div className={styles.navItemsContainer}>
                  <FaChartBar /> Stats
                </div>
              </button>
            </Modal.Open>
            <Modal.Window name='stats'>
              <Statistics />
            </Modal.Window>

            <Modal.Open opens='settings'>
              <button className={styles.settingsButton} ref={openSettingsRef}>
                <div className={styles.navItemsContainer}>
                  <FaCog /> Settings
                </div>
              </button>
            </Modal.Open>
            <Modal.Window name='settings'>
              <Settings />
            </Modal.Window>

            <Modal.Open opens='shortcuts'>
              <button className={styles.shortcutsButton} ref={openShortcutsRef}>
                <div className={styles.navItemsContainer}>
                  <FaKeyboard /> Shortcuts
                </div>
              </button>
            </Modal.Open>
            <Modal.Window name='shortcuts'>
              <KeyboardShortcuts />
            </Modal.Window>
          </Modal>
        </nav>
        {/*     <div className={styles.themeSelector}>
          <label htmlFor='theme-dropdown'>Choose a theme:</label>
          <select
            id='theme-dropdown'
            onChange={(e) => changeTheme(e.target.value)}
          >
            <option value='dark'>Dark</option>
            <option value='playful'>Playful</option>
            <option value='calm'>Calm</option>
            <option value='bold'>Bold</option>
            <option value='serious'>Serious</option>
            <option value='startup'>Startup</option>
            <option value='plain'>Plain</option>
          </select>
        </div> */}
      </div>
    </header>
  );
}

export default Header;
