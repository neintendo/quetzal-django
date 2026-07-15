import styles from "../../styles/Categories/CategoriesDoughnut.module.css";
import { Doughnut } from "react-chartjs-2";
import SetTheme from "../Settings/SetTheme";


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const CategoriesDoughnut = ({ enhancedCategoriesData }) => {
  const { theme } = SetTheme();

  if (!enhancedCategoriesData) {
    return (
      <div className={styles["categories-doughnut-loading"]}>
        [ Loading Doughnut... ]
      </div>
    );
  }

  // Map categories
  const labels = [
    ...new Set(
      enhancedCategoriesData
        .filter((category) => category.total !== 0)
        .map((category) => category.name),
    ),
  ].sort();

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
    cutout: "50%",
    radius: "95%",
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
        position: "right",
        align: "center",
        labels: {
          font: { family: "DepartureMono-Regular", size: 11 },
          color: "#444444",
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
      <div className={styles["categories-doughnut-canvas"]}>
        {labels.length === 0 ? (
          <div className={styles["categories-doughnut-loading"]}>
            [ No Data ]
          </div>
        ) : (
          <Doughnut id="cat_chart" options={options} data={canvasData} />
        )}
      </div>
    </>
  );
};

export default CategoriesDoughnut;
