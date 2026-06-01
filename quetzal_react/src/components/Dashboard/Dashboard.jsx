import "../../styles/Dashboard/Dashboard.css";
import { useState } from "react";
import TransactionDetail from "../Transactions/TransactionDetail";
import DashboardStatus from "./DashboardStatus";
import DashboardGraph from "./DashboardGraph";
import RecentTransactions from "./RecentTransactions";

const Dashboard = () => {
  const [showTransactionDetailModal, setShowTransactionDetailModal] =
    useState(false);
  const [selectedTransactionID, setSelectedTransactionID] = useState("");
  const [selectedTransactionDatetime, setSelectedTransactionDatetime] =
    useState("");
  const [selectedTransactionDescription, setSelectedTransactionDescription] =
    useState("");
  const [selectedTransactionNotes, setSelectedTransactionNotes] = useState("");
  const [selectedTransactionAmount, setSelectedTransactionAmount] =
    useState("");
  const [selectedTransactionCategory, setSelectedTransactionCategory] =
    useState("");
  const [selectedTransactionAccount, setSelectedTransactionAccount] =
    useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedLinkedTransaction, setSelectedLinkedTransaction] =
    useState("");
  const [selectedTransactionCurrency, setSelectedTransactionCurrency] =
    useState("");

  // Refresh data in RecentTransactions
  const [refresh, setRefresh] = useState(0);

  // Data from table row in child (RecentTransactions) component
  const handleRowClick = (
    idFromChild,
    datetimeFromChild,
    descriptionFromChild,
    notesFromChild,
    amountFromChild,
    categoryFromChild,
    accountFromChild,
    currencyFromChild,
    typeFromChild,
    linkTransactionFromChild,
  ) => {
    setSelectedTransactionID(idFromChild);
    setSelectedTransactionDatetime(datetimeFromChild);
    setSelectedTransactionDescription(descriptionFromChild);
    setSelectedTransactionNotes(notesFromChild);
    setSelectedTransactionAmount(amountFromChild);
    setSelectedTransactionCategory(categoryFromChild);
    setSelectedTransactionAccount(accountFromChild);
    setSelectedTransactionCurrency(currencyFromChild);
    setSelectedTransactionType(typeFromChild);
    setSelectedLinkedTransaction(linkTransactionFromChild);
    setShowTransactionDetailModal(true);
  };

  // RecentTransactions: Refresh data on transaction update
  const handleTransactionUpdate = () => {
    setShowTransactionDetailModal(false);
    setRefresh((prev) => prev + 1);
  };

  // RecentTransactions: Refresh data on transaction delete
  const handleTransactionDelete = () => {
    setShowTransactionDetailModal(false);
    setRefresh((prev) => prev + 1);
  };

  return (
    <>
      {showTransactionDetailModal && (
        <TransactionDetail
          route={`/transactions/${selectedTransactionID}/`}
          onClose={() => setShowTransactionDetailModal(false)}
          onSuccess={handleTransactionUpdate}
          onTransactionDelete={handleTransactionDelete}
          readID={selectedTransactionID}
          readDatetime={selectedTransactionDatetime}
          readDescription={selectedTransactionDescription}
          readNotes={selectedTransactionNotes}
          readAmount={selectedTransactionAmount}
          readCategory={selectedTransactionCategory}
          readAccount={selectedTransactionAccount}
          readCurrency={selectedTransactionCurrency}
          readType={selectedTransactionType}
          readLinkedTransaction={selectedLinkedTransaction}
        />
      )}
      <div className="dashboard">
        <DashboardStatus />
        <div className="dashboard-graph-container">
          <div className="dashboard-graph-title">Spending</div>
          <DashboardGraph />
        </div>
        <div className="dashboard-summaries-container">
          <div className="recents-table-container">
            <div className="recents-table-title">Recent Transactions</div>
            <RecentTransactions onRowClick={handleRowClick} refresh={refresh} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
