import api from "../../api";
import "../../styles/Dashboard/DashboardGraph.css";
import CurrentMonth from "../Utilities/CurrentMonth";
import { useState, useEffect } from "react";
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

const DashboardGraph = () => {
  const [dailyTransactionData, setDailyTransactionData] = useState(null);
  const { currentMonth } = CurrentMonth();

  useEffect(() => {
    const getTransactionData = () => {
      api
        .get("transactions/spending-graph", {
          params: { transaction_type: "expense", start_date: currentMonth },
        })
        .then((res) => res.data)
        .then((data) => {
          setDailyTransactionData(data.daily_transactions_by_month);
          console.log(data);
        })
        .catch((err) => alert(err));
    };

    getTransactionData();
  }, []);

  if (!dailyTransactionData) {
    return <div className="dashboard-graph-loading">[ Loading Graph... ]</div>;
  }

  const dateNow = new Date();
  const firstDayOfMonth = new Date(currentMonth);
  let weekdayCounter = firstDayOfMonth.getDay();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  let fill_days = [];
  let keyDate = [];

  for (let a = 0, b = 1; a < dateNow.getDate(); a++, b++, weekdayCounter++) {
    fill_days[a] = `${weekdays[weekdayCounter]} ${b}`;
    if (weekdayCounter === 7) {
      weekdayCounter = 0;
    }
  }

  for (let c = 0, day = 1; c < dateNow.getDate(); c++, day++) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const formattedFirstDay = `${year}-${String(month + 1).padStart(2, "0")}-${day < 10 ? "0" + day : day}`;

    keyDate[c] = formattedFirstDay;
  }
  const f_days = fill_days;
  const amounts = [];

  for (let d = 0; d < f_days.length; d++) {
    if (amounts[0] == undefined) {
      amounts[0] = 0;
    }
    amounts[d] = dailyTransactionData[keyDate[d]];
    if (amounts[d] == undefined) {
      amounts[d] = amounts[d - 1];
    }
  }
  console.log(amounts);

  const canvasData = {
    labels: fill_days,
    datasets: [
      {
        label: "Total Spent",
        data: amounts,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        titleFont: { family: "DepartureMono-Regular", size: 11 },
        bodyFont: { family: "DepartureMono-Regular", size: 10 },
        titleColor: "#eeeeee",
        bodyColor: "#eeeeee",
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
          color: "#444444",
        },
      },
      y: {
        ticks: {
          font: { family: "DepartureMono-Regular", size: 11 },
          color: "#444444",
        },
      },
    },
  };

  return (
    <>
      <div className="dashboard-graph-canvas">
        <Line id="dash_graph" options={options} data={canvasData} />
      </div>
    </>
  );
};

export default DashboardGraph;
