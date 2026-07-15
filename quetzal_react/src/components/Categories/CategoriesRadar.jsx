import styles from "../../styles/Categories/CategoriesRadar.module.css";
import SetTheme from "../Settings/SetTheme";
import { Radar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";

ChartJS.register(
  LineElement,
  RadialLinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadarController,
);

const CategoriesRadar = ({
  enhancedCategoriesData,
  enhancedRadarData,
  enhancedRadarPrevData,
}) => {
  const { theme } = SetTheme();

  if (!enhancedRadarData) {
    return (
      <div className={styles["categories-radar-loading"]}>
        [ Loading Radar... ]
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
    const a = enhancedRadarData.find((item) => item.name === label);
    return a?.total || 0;
  });

  const amountsRadar = labels.map((label) => {
    const a = enhancedRadarPrevData.find((item) => item.name === label);
    return a?.total || 0;
  });

  const canvasData = {
    labels: labels,
    datasets: [
      {
        label: "Current Month",
        data: amounts,
        backgroundColor:
          theme === "dark"
            ? "rgba(255, 84, 68, 0.33)"
            : "rgba(68, 68, 68, 0.33)",
        borderColor: theme === "dark" ? "#ff5444" : "#ffffff",
        borderWidth: 1,
      },
      {
        label: "Previous Month",
        data: amountsRadar,
        backgroundColor: "rgba(119, 119, 119, 0.33)",
        borderColor: "#888888",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
    scales: {
      r: {
        grid: {
          color: "#aaaaaa",
        },
        angleLines: {
          color: "#bbbbbb",
        },
        ticks: {
          backdropColor: theme === "dark" ? "#222222" : "#dddddd",
          font: { family: "DepartureMono-Regular", size: 10 },
          color: theme === "dark" ? "#bbbbbb" : "#444444",
        },
        pointLabels: {
          font: { family: "DepartureMono-Regular", size: 10 },
          color: "#444444",
          display: false,
        },
      },
    },
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
        align: "center",
        labels: {
          font: { family: "DepartureMono-Regular", size: 10 },
          color: theme === "dark" ? "#bbbbbb" : "#444444",
          textAlign: "center",
          usePointStyle: true,
          pointStyle: "star",
          padding: 16,
          boxHeight: 6,
        },
      },
    },
  };
  return (
    <>
      <div className={styles["categories-radar-canvas"]}>
        {labels.length === 0 ? (
          <div className={styles["categories-radar-loading"]}>[ No Data ]</div>
        ) : (
          <Radar id="cat_radar" options={options} data={canvasData} />
        )}
      </div>
    </>
  );
};

export default CategoriesRadar;
