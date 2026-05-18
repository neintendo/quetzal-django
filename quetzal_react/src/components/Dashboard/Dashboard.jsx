import "../../styles/Dashboard/Dashboard.css";
import DashboardStatus from "./DashboardStatus";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <DashboardStatus />
        <div className="dashboard-graph-container"></div>
      </div>
    </>
  );
};

export default Dashboard;
