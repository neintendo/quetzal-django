import "../../styles/Categories/CategoriesDoughnut.css";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const CategoriesDoughnut = ({ enhancedCategoriesData }) => {
  if (!enhancedCategoriesData) {
    return (
      <div className="categories-graph-loading">[ Loading Charts... ]</div>
    );
  }

  // Map categories
  const labels = [
    ...new Set(enhancedCategoriesData.map((category) => category.name)),
  ].sort();
  console.log(enhancedCategoriesData);

  // Maps amounts
  const amounts = labels.map((label) => {
    const a = enhancedCategoriesData.find((item) => item.name === label);
    return a?.total || 0;
  });

  const canvasData = {
    labels: labels,
    datasets: [
      {
        label: "Total",
        data: amounts,
        backgroundColor: [
          "#444444",
          "#555555",
          "#666666",
          "#777777",
          "#888888",
          "#999999",
          "#aaaaaa",
          "#bbbbbb",
        ],
        borderColor: "#cccccc",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: "70%",
    radius: "95%",
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          boxHeight: 6,
        },
      },
    },
  };
  return (
    <>
      <div className="categories-doughnut-canvas">
        <Doughnut id="cat_chart" options={options} data={canvasData} />
      </div>
    </>
  );
};

export default CategoriesDoughnut;
