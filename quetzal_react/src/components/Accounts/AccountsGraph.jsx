import api from "../../api";
import "../../styles/AccountsGraph.css";
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
    labels: f_months,
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
