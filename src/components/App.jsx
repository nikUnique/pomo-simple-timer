import { PomodoroProvider } from "./PomodoroContext.jsx";

import styles from "./App.module.css";
import Header from "./Header.jsx";
import TimerInterface from "./TimerInterface.jsx";
import { useGetPomodoroData } from "../hooks/useGetPomodoroData.js";
import { useSetPomodoroCount } from "../hooks/useSetPomodoroCount.js";
import Statistics from "./Statistics.jsx";

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
