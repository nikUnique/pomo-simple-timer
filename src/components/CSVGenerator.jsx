import { useStatsData } from "./PomodoroContext";
import styles from "./CSVGenerator.module.css";
function CSVGenerator() {
  const { pomodoroList } = useStatsData();

  // function convertToCSV() {
  // // First bad version
  // const headers = Object.keys(pomodoroList[0]).join(",") + "\n";
  // const rows = pomodoroList
  //   .map((pomodoro) => Object.values(pomodoro).join(","))
  //   .join("\n");
  // console.log(headers + rows);
  // return headers + rows;

  // }

  // Second version
  function convertToCSV(data) {
    if (!data || data.length === 0) return "";

    // const headers =
    //   Object.keys(data[0])
    //     .map((header) => `"${header}"`)
    //     .join(",") + "\n";

    // const rows = data
    //   .map((row) =>
    //     Object.values(row)
    //       .map((value, i, arr) => {
    //         console.log(value);
    //         console.log(!value, "empty");
    //         if (arr.length - 1 === i) console.log("-------------------");

    //         if (
    //           value === "" ||
    //           value === null ||
    //           value === undefined ||
    //           value.length === 0
    //         )
    //           return `"empty field"`;

    //         return `"${value}"`;
    //       })
    //       .join(",")
    //   )
    //   .join("\n");
    const headers =
      [
        "Timer name",
        "Start",
        "End",
        "Timer events",
        "Selected time",
        "Duration",
        "Reset",
        "Reset date",
        "Reset time",
      ]
        .map((header) => `"${header}"`)
        .join(",") + "\n";

    const rows = data
      .map((row) => {
        let duration;
        if (!row.duration) {
          duration = "Timer was interrupted";
        }
        if (row.duration < 60) {
          duration = row.duration + " sec";
        }
        if (row.duration >= 60) {
          duration = Math.floor(row.duration / 60) + " min";
        }

        return [
          `"${row.timerName}"`,
          `"${new Date(row.start).toLocaleTimeString()}"`,
          `"${row.end ? new Date(row.end).toLocaleTimeString() : "empty"}"`,
          `"${row.events.length ? row.events.join(", ") : "no events"}"`,
          `"${
            row.selectedTime >= 60
              ? Math.floor(row.selectedTime / 60) + " min"
              : row.selectedTime + " sec"
          }"`,
          `"${duration}"`,
          `"${(row.reset && "yes") || "no"}"`,
          `"${
            row.resetDate
              ? new Date(row.resetDate).toLocaleDateString()
              : "empty"
          }"`,
          `"${
            row.resetTime ? row.resetTime.split(",").at(1).trim() : "empty"
          }"`,
        ].join(", ");
      })
      .join("\n");

    return headers + rows;
  }

  function formatDate(date, includeWeekDay) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = includeWeekDay
      ? date.toLocaleDateString(navigator.language, {
          weekday: "long",
        })
      : "";

    if (includeWeekDay) return `${dayOfWeek}-${year}-${month}-${day}`;

    return `${year}-${month}-${day}`;
  }

  function downloadCSV(csvData) {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const start = new Date(pomodoroList.at(0).start);
    const end = new Date(pomodoroList.at(-1).start);

    const fileName =
      start.getDate() === end.getDate()
        ? `timer-stats_${formatDate(start, true)}.csv` // Single day
        : `timer-stats_${formatDate(start)}_to_${formatDate(end)}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  function handleExport() {
    const csvData = convertToCSV(pomodoroList);
    downloadCSV(csvData);
  }

  return (
    <button className={styles.exportBtn} onClick={handleExport}>
      Export history
    </button>
  );
}

export default CSVGenerator;
