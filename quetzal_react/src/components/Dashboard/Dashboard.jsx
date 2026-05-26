import "../../styles/Dashboard/Dashboard.css";
import DashboardStatus from "./DashboardStatus";
import DashboardGraph from "./DashboardGraph";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <DashboardStatus />
        <div className="dashboard-graph-container">
          <div className="dashboard-graph-title">Spending</div>
          <DashboardGraph />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
