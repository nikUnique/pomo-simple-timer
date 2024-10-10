import { PomodoroProvider } from "./PomodoroContext";

import styles from "./App.module.css";
import Header from "./Header";
import TimerInterface from "./TimerInterface";
import { useGetPomodoroData } from "../hooks/useGetPomodoroData";
import { useSetPomodoroCount } from "../hooks/useSetPomodoroCount";
import Statistics from "./Statistics";

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
