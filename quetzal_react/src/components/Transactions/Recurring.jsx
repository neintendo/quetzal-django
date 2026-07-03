import RecurringTable from "./RecurringTable";
import { useState, useEffect } from "react";
import api from "../../api";
import styles from "../../styles/Transactions/Recurring.module.css";
import AddRecurring from "./AddRecurring";

const Recurring = () => {
  const [recurringData, setRecurringData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = () => {
    Promise.all([api.get("recurring/")])
      .then(([recurringRes]) => {
        setRecurringData(recurringRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => {
    fetchData();
  };

  const handleTransactionAdded = () => {
    setShowAddModal(false);
    refresh();
  };

  return (
    <>
      {showAddModal && (
        <AddRecurring
          route="/recurring/"
          onClose={() => setShowAddModal(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
      <div className={styles.recurring}>
        <div className={styles["recurring-table-container"]}>
          <div className={styles["recurring-table-header"]}>
            <div className={styles["recurring-table-title-container"]}>
              <div className={styles["recurring-table-title"]}>
                Recurring Transactions
              </div>
            </div>
            <input
              className={styles["table-header-input"]}
              placeholder="Search Recurring Transactions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={styles["create-button"]}
              onClick={() => setShowAddModal(true)}
            >
              {"+ Add Recurring Transaction"}
            </button>
          </div>
          <RecurringTable
            recurringData={recurringData}
            searchTerm={searchTerm}
            // onRowClick={handleRowClick}
          />
        </div>
      </div>
    </>
  );
};

export default Recurring;
