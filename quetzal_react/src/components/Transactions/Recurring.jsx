import RecurringTable from "./RecurringTable";
import { useState, useEffect } from "react";
import api from "../../api";
import styles from "../../styles/Transactions/Recurring.module.css";
import AddRecurring from "./AddRecurring";
import RecurringDetail from "./RecurringDetail";

const Recurring = () => {
  const [recurringData, setRecurringData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecurringDetailModal, setShowRecurringDetailModal] =
    useState(false);
  const [selectedTransactionID, setSelectedTransactionID] = useState("");
  const [selectedTransactionStartDate, setSelectedTransactionStartDate] =
    useState("");
  const [selectedTransactionFrequency, setSelectedTransactionFrequency] =
    useState("");
  const [selectedTransactionEndDate, setSelectedTransactionEndDate] =
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
  const [
    selectedTransactionDestinationAccount,
    setSelectedTransactionDestinationAccount,
  ] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedTransactionCurrency, setSelectedTransactionCurrency] =
    useState("");

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

  const handleRowClick = (
    idFromChild,
    startDateFromChild,
    endDateFromChild,
    frequencyFromChild,
    descriptionFromChild,
    notesFromChild,
    amountFromChild,
    categoryFromChild,
    accountFromChild,
    destionationAccountFromChild,
    currencyFromChild,
    typeFromChild,
  ) => {
    setSelectedTransactionID(idFromChild);
    setSelectedTransactionStartDate(startDateFromChild);
    setSelectedTransactionEndDate(endDateFromChild);
    setSelectedTransactionFrequency(frequencyFromChild);
    setSelectedTransactionDescription(descriptionFromChild);
    setSelectedTransactionNotes(notesFromChild);
    setSelectedTransactionAmount(amountFromChild);
    setSelectedTransactionCategory(categoryFromChild);
    setSelectedTransactionAccount(accountFromChild);
    setSelectedTransactionDestinationAccount(destionationAccountFromChild);
    setSelectedTransactionCurrency(currencyFromChild);
    setSelectedTransactionType(typeFromChild);
    setShowRecurringDetailModal(true);
  };

  const handleTransactionUpdate = () => {
    setShowRecurringDetailModal(false);
    refresh();
  };

  const handleTransactionDelete = () => {
    setShowRecurringDetailModal(false);
    refresh();
  };

  const handleTransactionAdded = () => {
    setShowAddModal(false);
    refresh();
  };

  return (
    <>
      {showRecurringDetailModal && (
        <RecurringDetail
          route={`/recurring/${selectedTransactionID}/`}
          onClose={() => setShowRecurringDetailModal(false)}
          onSuccess={handleTransactionUpdate}
          onTransactionDelete={handleTransactionDelete}
          readID={selectedTransactionID}
          readStartDate={selectedTransactionStartDate}
          readEndDate={selectedTransactionEndDate}
          readFrequency={selectedTransactionFrequency}
          readDescription={selectedTransactionDescription}
          readNotes={selectedTransactionNotes}
          readAmount={selectedTransactionAmount}
          readCategory={selectedTransactionCategory}
          readAccount={selectedTransactionAccount}
          readDestinationAccount={selectedTransactionDestinationAccount}
          readCurrency={selectedTransactionCurrency}
          readType={selectedTransactionType}
        />
      )}

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
          <div className={styles["sub-table-container"]}>
            <RecurringTable
              recurringData={recurringData}
              searchTerm={searchTerm}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Recurring;
