import { useEffect, useState } from "react";
import api from "../../api";
import styles from "../../styles/Transactions/RecurringDetail.module.css";

const RecurringDetail = ({
  route,
  onClose,
  onSuccess,
  onTransactionDelete,
  readStartDate,
  readEndDate,
  readFrequency,
  readDatetimes,
  readAmount,
  readDescription,
  readNotes,
  readCategory,
  readType,
  readAccount,
  readDestinationAccount,
  readCurrency,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Form handling
  const [start_date, setStartDate] = useState(readStartDate);
  const [end_date, setEndDate] = useState(readEndDate);
  const [frequency, setFrequency] = useState(readFrequency);
  const [amount, setAmount] = useState(readAmount);
  const [description, setDescription] = useState(readDescription);
  const [notes, setNotes] = useState(readNotes);
  const [category, setCategory] = useState(readCategory);
  const [transaction_type, setType] = useState(readType);
  const [account, setAccount] = useState(readAccount);
  const [destination_account, setDestinationAccount] = useState(
    readDestinationAccount,
  );
  const [currency, setCurrency] = useState(readCurrency);
  const [method, setMethod] = useState("put");
  const [loading, setLoading] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);

  const getUserAccounts = () => {
    api
      .get("accounts/")
      .then((res) => res.data)
      .then((data) => {
        setUserAccounts(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getUserAccounts();

    function clickOutside(event) {
      const modal = document.getElementById("divListen");
      if (modal && !modal.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [onClose]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e) => {
    {
      method === "delete" ? setLoadingB(true) : setLoading(true);
    }
    e.preventDefault();

    if (method === "delete") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this transaction? This action cannot be undone!",
      );
      if (!confirmed) {
        setLoadingB(false);
        return;
      }
    }
    if (method === "put") {
      const confirmed = window.confirm(
        "Updating the start date, end date, or frequency will regenerate " +
          "the entire transaction schedule. This will create duplicate or " +
          "unexpected transactions. Do you want to proceed? ",
      );
      if (!confirmed) {
        setLoading(false);
        return;
      }
    }

    try {
      let requestData;

      if (method === "put") {
        requestData = {
          start_date,
          end_date,
          frequency,
          amount,
          description,
          category,
          account,
          transaction_type,
          currency,
        };

        if (transaction_type === "transfer") {
          requestData.destination_account = destination_account;
        }
        if (notes !== "") {
          requestData.notes = notes;
        }
        if (notes.length < 1) {
          requestData.notes = null;
        }
      }

      const res = await api[method](route, requestData);

      if (res.status === 200) {
        alert("Transaction updated successfully!");
      }
      if (res.status === 204) {
        alert("Transaction deleted successfully!");
        onTransactionDelete();
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        // Shows status errors from the backend to the user.
        alert(JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error("No response received", error.request);
        alert(
          "No response from server. Please check if the backend is running :)",
        );
      } else {
        console.error("Error:", error.message);
        alert(error.message);
      }
    } finally {
      {
        method === "delete" ? setLoadingB(false) : setLoading(false);
      }
    }
  };

  let startDateStr = readStartDate.replace(" ", "T");
  let endDateStr = readEndDate.replace(" ", "T");
  let nextDateStr = readDatetimes[0].replace(" ", "T");
  const newStartDate = Date.parse(startDateStr);
  const newEndDate = Date.parse(endDateStr);
  const newNextDate = Date.parse(nextDateStr);

  return (
    <>
      <div className={styles["recurring-detail-modal-container"]}>
        <div className={styles["recurring-detail-modal"]} id="divListen">
          <div className={styles["datetime-close"]}>
            <div className={styles["datetime-frequency-container"]}>
              <div className={styles["datetime"]}>
                {"Start Date: "}
                {new Intl.DateTimeFormat(undefined, {
                  year: "numeric",
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                  .format(newStartDate)
                  .replace(", ", " | ")}
              </div>
              <div className={styles["datetime"]}>
                {"End Date: "}
                &nbsp;&nbsp;
                {new Intl.DateTimeFormat(undefined, {
                  year: "numeric",
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                  .format(newEndDate)
                  .replace(", ", " | ")}
              </div>
            </div>
            <div
              className={styles["modal-close-button"]}
              onClick={onClose}
              title="Close Modal"
            >
              X
            </div>
          </div>
          <div className={styles["details-splitter-container"]}>
            <div className={styles["details-left"]}>
              <div className={styles["desc-cat"]}>
                <div className={styles["description"]}>{readDescription}</div>
                <div className={styles["category"]}>{readCategory}</div>
                <div className={styles["frequency"]}>{readFrequency}</div>
              </div>
            </div>
            <div className={styles["details-right"]}>
              <div className={styles["bal-type-acc"]}>
                <div className={styles["type"]}>{readType}</div>
                <div className={styles["balance"]}>
                  {Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: readCurrency,
                  }).format(readAmount)}
                </div>
                <div>{readAccount}</div>
                {readDestinationAccount !== null ? (
                  <div>
                    {"› "}
                    {readDestinationAccount}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className={styles["datetime-alt"]}>
            {"› Next Transaction: "}
            {new Intl.DateTimeFormat(undefined, {
              year: "numeric",
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
              .format(newNextDate)
              .replace(", ", " | ")}
          </div>
          {readNotes !== null ? (
            <p className={styles["notes-container"]}>{readNotes}</p>
          ) : (
            ""
          )}
          <div className={styles["expanded-modal"]}>
            {isExpanded ? (
              <div
                className={styles["collapse-button"]}
                onClick={toggleExpansion}
                title="Collapse Modal"
              >
                {"<"}
              </div>
            ) : (
              <div
                className={styles["expand-button"]}
                onClick={toggleExpansion}
                title="Expand Modal"
              >
                {">"}
              </div>
            )}
            {isExpanded ? (
              <form
                onSubmit={handleSubmit}
                className={styles["transaction-form-container"]}
              >
                <div className={styles["date-label-container"]}>
                  <label className={styles["date-label"]}>Start Date</label>
                  <label className={styles["date-label"]}>End Date</label>
                </div>
                <div className={styles["date-input-container"]}>
                  <input
                    className={styles["edit-transaction-form-input"]}
                    type="datetime-local"
                    value={start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <input
                    className={styles["edit-transaction-form-input"]}
                    type="datetime-local"
                    value={end_date}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <select
                  className={styles["edit-transaction-form-input"]}
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="Frequency"
                  required
                >
                  <optgroup label="Frequency">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </optgroup>
                </select>
                <input
                  className={styles["edit-transaction-form-input"]}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  required
                />
                <input
                  className={styles["edit-transaction-form-input"]}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                />
                <input
                  className={styles["edit-transaction-form-input"]}
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes"
                />
                <input
                  className={styles["edit-transaction-form-input"]}
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  required
                />
                <select
                  className={styles["edit-transaction-form-input"]}
                  type="text"
                  value={transaction_type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Transaction Type"
                  required
                >
                  <optgroup label="Transaction Type">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="transfer">Transfer</option>) : ( ""
                  </optgroup>
                </select>

                <select
                  className={styles["edit-transaction-form-input"]}
                  type="text"
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                    const selectedAccount = userAccounts?.find(
                      (accountMap) => accountMap.name === e.target.value,
                    );
                    setCurrency(selectedAccount?.currency || "");
                  }}
                  required
                >
                  <optgroup label="Account">
                    <option>- Select Account -</option>
                    {userAccounts &&
                      Array.isArray(userAccounts) &&
                      [...userAccounts]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((accountMap, index) => (
                          <option key={index} value={accountMap.name}>
                            {accountMap.name} ({accountMap.currency})
                          </option>
                        ))}
                  </optgroup>
                </select>
                {transaction_type === "transfer" && (
                  <select
                    className={styles["edit-transaction-form-input"]}
                    type="text"
                    value={destination_account}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                  >
                    <optgroup label="Destination Account">
                      <option>- Select Destination Account -</option>
                      {userAccounts &&
                        Array.isArray(userAccounts) &&
                        [...userAccounts]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((accountMap, index) =>
                            accountMap.currency === currency &&
                            account !== accountMap.name ? (
                              <option key={index} value={accountMap.name}>
                                {accountMap.name} ({accountMap.currency})
                              </option>
                            ) : null,
                          )}
                    </optgroup>
                  </select>
                )}
                <button
                  className={styles["edit-transaction-form-button"]}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "LOADING..." : "Update Recurring Transaction"}
                </button>
                <hr></hr>
                <button
                  className={styles["delete-transaction-form-button"]}
                  onClick={() => setMethod("delete")}
                  type="submit"
                  disabled={loadingB}
                >
                  {loadingB ? "LOADING..." : "Delete Recurring Transaction"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
export default RecurringDetail;
