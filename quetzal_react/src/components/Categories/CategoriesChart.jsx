import api from "../../api";
import styles from "../../styles/Categories/CategoriesChart.module.css";
import SetTheme from "../Settings/SetTheme";
import { useState, useEffect, useSyncExternalStore } from "react";
import { GlobalRefresh } from "../Utilities/GlobalRefresh";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const CategoriesChart = ({
  categoryID,
  conv_int,
  transDetailRefresher,
  startDate,
  endDate,
  account,
}) => {
  // Re-fetch data when GlobalRefresh.trigger is called elsewhere
  const globalRefresh = useSyncExternalStore(
    GlobalRefresh.subscribe,
    GlobalRefresh.getSnapshot,
  );

  const [transactionData, setTransactionData] = useState(null);
  const { theme } = SetTheme();

  useEffect(() => {
    const getTransactionData = () => {
      api
        .get("categories/chart", {
          params: {
            category: categoryID,
            category_converted_transactions: conv_int,
            start_date: startDate,
            end_date: endDate,
            account,
          },
        })
        .then((res) => res.data)
        .then((data) => {
          setTransactionData(data.category_transactions_by_month);
        })
        .catch((err) => alert(err));
    };

    getTransactionData();
  }, [
    globalRefresh,
    categoryID,
    conv_int,
    transDetailRefresher,
    startDate,
    endDate,
    account,
  ]);

  if (!transactionData) {
    return (
      <div className={styles["categories-chart-loading"]}>
        [ Loading Graph... ]
      </div>
    );
  }

  // Get months then fills gaps
  const months = Object.keys(transactionData).sort();
  let fill_months = [];
  fill_months[0] = months[0];
  let a = 1;
  let date = new Date(months[0]);

  while (fill_months[fill_months.length - 1] != months[months.length - 1]) {
    date.setMonth(date.getMonth() + 1);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let newMonthStr = `${year}-${month}`;
    fill_months[a] = newMonthStr;
    a++;
  }

  // Custom month labels
  let labels = [];
  // Skip if there's no data
  if (Object.keys(transactionData) != 0) {
    for (let b = 0; b < fill_months.length; b++) {
      let month_int = fill_months[b].slice(-2);
      if (month_int[0] == 0) {
        month_int = month_int.slice(1);
      }
      month_int -= 1;
      let year_int = fill_months[b].slice(0, 4);
      let new_date = new Date(year_int, month_int);
      let opts = { year: "numeric", month: "short" };
      new_date = Intl.DateTimeFormat("en", opts).format(new_date);
      labels[b] = new_date;
    }
  }

  const f_months = fill_months;

  // Maps transactions
  const amounts = f_months.map((f_month) => transactionData[f_month]);
  for (let b = 0; b < f_months.length; b++) {
    if (amounts[b] == undefined) {
      amounts[b] = 0;
    }
    if (amounts[b] <= 0) {
      amounts[b] *= -1;
    }
  }

  const canvasData = {
    labels: labels,
    datasets: [
      {
        label: "Balance",
        data: amounts,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    backgroundColor: theme === "dark" ? "rgba(187, 187, 187, 0.25" : undefined,
    indexAxis: "y",
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
        display: false,
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
      <div className={styles["categories-chart-canvas"]}>
        <Bar id="cat_bar" options={options} data={canvasData} />
      </div>
    </>
  );
};

export default CategoriesChart;
