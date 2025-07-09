import { PomodoroProvider } from "./PomodoroContext";

import styles from "./App.module.css";
import Header from "./Header";
import TimerInterface from "./TimerInterface";
import { useGetPomodoroData } from "../hooks/useGetPomodoroData.js";
import { useSetPomodoroCount } from "../hooks/useSetPomodoroCount.js";
import Statistics from "./Statistics";
import Notifications from "./Notifications.jsx";

function PomodoroApp() {
  useGetPomodoroData();
  useSetPomodoroCount();
  return (
    <div className={styles.app}>
      <Header>
        <Statistics />
      </Header>
      <main className={styles.appMain}>
        <TimerInterface />
      </main>
      <Notifications />
    </div>
  );
}

function App() {
  return (
    <PomodoroProvider>
      <PomodoroApp />
    </PomodoroProvider>
  );
}

export default App;
