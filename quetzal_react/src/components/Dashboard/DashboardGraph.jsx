import api from "../../api";
import styles from "../../styles/Dashboard/DashboardGraph.module.css";
import CurrentMonth from "../Utilities/CurrentMonth";
import PreviousMonth from "../Utilities/PreviousMonth";
import SetTheme from "../Settings/SetTheme";
import { useState, useEffect, useSyncExternalStore } from "react";
import { GlobalRefresh } from "../Utilities/GlobalRefresh";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const DashboardGraph = ({ refresh }) => {
  // Re-fetch data when GlobalRefresh.trigger is called elsewhere
  const globalRefresh = useSyncExternalStore(
    GlobalRefresh.subscribe,
    GlobalRefresh.getSnapshot,
  );

  const [dailyTransactionData, setDailyTransactionData] = useState([]);
  const [otherDailyTransactionData, setOtherDailyTransactionData] = useState(
    [],
  );
  const { currentMonth } = CurrentMonth();
  const { previousMonth } = PreviousMonth();
  const { prevMonthNumberOfDays } = PreviousMonth();
  const { previousMonthLastDay } = PreviousMonth();
  const { theme } = SetTheme();

  const fetchData = () => {
    Promise.all([
      // Expenses sorted by days for the current month
      api.get("transactions/spending-graph", {
        params: { start_date: currentMonth },
      }),
      // Expenses sorted by days for the previous month
      api.get("transactions/spending-graph", {
        params: { start_date: previousMonth, end_date: previousMonthLastDay },
      }),
    ])
      .then(([currentMonRes, otherMonRes]) => {
        setDailyTransactionData(currentMonRes.data.expenses_by_day);
        setOtherDailyTransactionData(otherMonRes.data.expenses_by_day);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [globalRefresh, refresh]);

  if (!dailyTransactionData) {
    return (
      <div className={styles["dashboard-graph-loading"]}>
        [ Loading Graph... ]
      </div>
    );
  }

  const dateNow = new Date();
  let fill_days = [];
  let keyDate = [];
  let keyDate2 = [];

  // Create labels up to today's date
  for (let a = 0, b = 1; a < dateNow.getDate(); a++, b++) {
    fill_days[a] = `Day ${b}`;
  }

  // Generate keys for mapping amounts
  for (let c = 0, day = 1; c < dateNow.getDate(); c++, day++) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${day < 10 ? "0" + day : day}`;
    keyDate[c] = formattedDay;
  }

  // Generate keys for mapping amounts (Second Dataset)
  for (let c = 0, day = 1; c < prevMonthNumberOfDays; c++, day++) {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() - 1;
    if (month === 0) {
      month = 11;
      year -= 1;
    }
    const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${day < 10 ? "0" + day : day}`;
    keyDate2[c] = formattedDay;
  }

  const f_days = fill_days;
  const amounts = [];
  const amounts2 = [];

  // Map amounts of current month
  for (let d = 0; d < f_days.length; d++) {
    if (amounts[0] == undefined) {
      amounts[0] = 0;
    }
    amounts[d] = dailyTransactionData[keyDate[d]];
    if (amounts[d] == undefined) {
      amounts[d] = amounts[d - 1];
    }
  }

  // Map amounts of previous month
  for (let d = 0; d < prevMonthNumberOfDays; d++) {
    if (amounts2[0] == undefined) {
      amounts2[0] = 0;
    }
    amounts2[d] = otherDailyTransactionData[keyDate2[d]];
    if (amounts2[d] == undefined) {
      amounts2[d] = amounts2[d - 1];
    }
  }

  const canvasData = {
    labels: fill_days,
    datasets: [
      {
        label: "Current Month",
        data: amounts,
        fill: true,
        borderColor: theme === "dark" ? "#ff5444" : "#ffffff",
        backgroundColor:
          theme === "dark"
            ? "rgba(255, 84 ,68 , 0.25)"
            : "rgba(255, 255 ,255 , 0.25)",
      },
      {
        label: "Previous Month",
        data: amounts2,
        fill: true,
        borderColor: "#bbbbbb",
        backgroundColor:
          theme === "dark" ? "rgba(187, 187 ,187 , 0.05)" : undefined,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    borderColor: "#fffffff",
    plugins: {
      tooltip: {
        titleFont: { family: "DepartureMono-Regular", size: 11 },
        bodyFont: { family: "DepartureMono-Regular", size: 10 },
        titleColor: theme === "dark" ? "#cccccc" : "#333333",
        bodyColor: theme === "dark" ? "#cccccc" : "#333333",
        backgroundColor: theme === "dark" ? "rgba(68, 68, 68, 0.9)" : "rgba(187, 187, 187, 0.66)",
        borderColor: theme === "dark" ? "rgba(187, 187, 187, 0.66)" : "rgba(68, 68, 68, 0.9)",
        borderWidth: 0.5,
        cornerRadius: 2,
      },
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          font: { family: "DepartureMono-Regular", size: 11 },
          usePointStyle: true,
          color: theme === "dark" ? "#bbbbbb" : undefined,
          pointStyle: "star",
          padding: 16,
          boxHeight: 6,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { family: "DepartureMono-Regular", size: 11 },
          color: theme === "dark" ? "#bbbbbb" : "#444444",
        },
        grid: { color: theme === "dark" ? "#333333" : undefined },
      },
      y: {
        ticks: {
          font: { family: "DepartureMono-Regular", size: 11 },
          color: theme === "dark" ? "#bbbbbb" : "#444444",
        },
        grid: { color: theme === "dark" ? "#333333" : undefined },
      },
    },
  };

  return (
    <>
      <div className={styles["dashboard-graph-canvas"]}>
        <Line id="dash_graph" options={options} data={canvasData} />
      </div>
    </>
  );
};

export default DashboardGraph;
