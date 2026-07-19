import styles from "../../styles/Dashboard/Dashboard.module.css";
import api from "../../api";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GlobalRefresh } from "../Utilities/GlobalRefresh";
import TransactionDetail from "../Transactions/TransactionDetail";
import DashboardStatus from "./DashboardStatus";
import DashboardGraph from "./DashboardGraph";
import RecentTransactions from "./RecentTransactions";
import TopCategories from "./TopCategories";
import CurrentMonth from "../Utilities/CurrentMonth";

const Dashboard = () => {
  // Re-fetch data when GlobalRefresh.trigger is called elsewhere
  const globalRefresh = useSyncExternalStore(
    GlobalRefresh.subscribe,
    GlobalRefresh.getSnapshot,
  );

  const { currentMonth } = CurrentMonth();
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesGraphData, setCategoriesGraphData] = useState([]);
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
  const [refresh, setRefresh] = useState(0);

  const fetchData = () => {
    Promise.all([
      api.get("categories/"),
      api.get("categories/graph/", { params: { start_date: currentMonth } }),
    ])
      .then(([categoriesRes, categoriesGraphRes]) => {
        setCategoriesData(categoriesRes.data);
        setCategoriesGraphData(categoriesGraphRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [globalRefresh, refresh]);

  const enhancedCategoriesData = categoriesData
    .map((category) => {
      let total = 0;

      if (category.type === "expense") {
        total =
          categoriesGraphData?.transactions_by_category?.expenses?.[
            category.name
          ] * -1 || 0;
      } else if (category.type === "income") {
        total =
          categoriesGraphData?.transactions_by_category?.income?.[
            category.name
          ] || 0;
      }

      return {
        ...category,
        total: total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

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
      <div className={styles["dashboard"]}>
        <DashboardStatus />
        <div className={styles["dashboard-graph-container"]}>
          <div className={styles["dashboard-graph-title"]}>Spending</div>
          <DashboardGraph refresh={refresh} />
        </div>
        <div className={styles["dashboard-summaries-container"]}>
          <div className={styles["recents-table-container"]}>
            <div className={styles["recents-table-title"]}>
              Recent Transactions
            </div>
            <div style={{ overflowX: "scroll" }}>
              <RecentTransactions onRowClick={handleRowClick} refresh={refresh} />
            </div>
          </div>
          <div className={styles["top-categories-table-container"]}>
            <div className={styles["top-categories-table-title"]}>
              Top Categories This Month
            </div>
            <div style={{ overflowX: "scroll" }}>
              <TopCategories enhancedCategoriesData={enhancedCategoriesData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
