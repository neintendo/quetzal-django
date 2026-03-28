import api from "../../api";
import "../../styles/Accounts/AccountsGraph.css";
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

const AccountsGraph = ({ currencyFilter }) => {
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const getTransactionData = () => {
      api
        .get("accounts/graph", { params: { currency: currencyFilter } })
        .then((res) => res.data)
        .then((data) => {
          setTransactionData(data.transactions_by_month);
          console.log(data);
        })
        .catch((err) => alert(err));
    };

    getTransactionData();
  }, [currencyFilter]);

  if (!transactionData) {
    return <div className="accounts-graph-loading">[ Loading Graph... ]</div>;
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
      amounts[b] = amounts[b - 1];
      console.log(amounts[b]);
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
    plugins: {
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
      <div className="accounts-graph-canvas">
        <Line id="acc_graph" options={options} data={canvasData} />
      </div>
    </>
  );
};

export default AccountsGraph;
