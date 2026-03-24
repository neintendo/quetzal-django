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

  const months = Object.keys(transactionData).sort();
  const amounts = months.map((month) => transactionData[month]);

  const canvasData = {
    labels: months,
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
