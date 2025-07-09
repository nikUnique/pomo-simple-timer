import { useKey } from "../hooks/useKey";
import styles from "./KeyboardShortcuts.module.css";
function KeyboardShortcuts({ onCloseModal }) {
  useKey({ key: "escape" }, onCloseModal);
  return (
    <div>
      <h3 className={styles.shortcutsTitle}>Keyboard shortcuts</h3>
      <div className={styles.shortcutsBorder}></div>

      <section className={styles.shortcutsSection}>
        <div className={styles.shortcutsPanel}>
          <ShortcutsItem title='Open settings' keys={[","]} />
          <ShortcutsItem title='Open stats' keys={["S"]} />
          <ShortcutsItem title='Open shortcuts' keys={["/"]} />
        </div>
        <div className={styles.shortcutsPanel}>
          <ShortcutsItem title='Play/Pause' keys={["Spacebar"]} />
          <ShortcutsItem title='Reset timer' keys={["R"]} />
        </div>
      </section>
    </div>
  );
}

function ShortcutsItem({ title, keys }) {
  return (
    <div className={styles.shortcutsItem}>
      <p className={styles.shortcutsName}>{title}</p>

      <p className={styles.keyContainer}>
        {keys.map((key) => (
          <span className={styles.shortcutsKey} key={key}>
            {key}
          </span>
        ))}
      </p>
    </div>
  );
}

export default KeyboardShortcuts;
