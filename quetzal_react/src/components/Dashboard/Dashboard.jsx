import "../../styles/Dashboard/Dashboard.css";
import DashboardStatus from "./DashboardStatus";
import DashboardGraph from "./DashboardGraph";
import RecentTransactions from "./RecentTransactions";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard">
        <DashboardStatus />
        <div className="dashboard-graph-container">
          <div className="dashboard-graph-title">Spending</div>
          <DashboardGraph />
        </div>
        <div className="dashboard-summaries-container">
          <div className="recents-table-container">
            <div className="recents-table-title">Recent Transactions</div>
            <RecentTransactions />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
