import { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/Transactions/TransactionDetail.css";

const TransactionDetail = ({
  route,
  onClose,
  onSuccess,
  onTransactionDelete,
  readDatetime,
  readDescription,
  readNotes,
  readAmount,
  readCategory,
  readAccount,
  readCurrency,
  readType,
  readLinkedTransaction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Form handling
  const [amount, setAmount] = useState(readAmount);
  const [currency, setCurrency] = useState(readCurrency);
  const [description, setDescription] = useState(readDescription);
  const [notes, setNotes] = useState(readNotes);
  const [datetime, setDatetime] = useState(readDatetime);
  const [account_name, setAccount] = useState(readAccount);
  const [destination_account_name, setDestAccount] = useState();
  const [category_name, setCategory] = useState(readCategory);
  const [transaction_type, setType] = useState(readType);
  const [linked_transaction] = useState(readLinkedTransaction);
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
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getUserAccounts();
  }, []);

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

    try {
      let requestData;

      if (method === "put") {
        requestData = {
          amount,
          currency,
          description,
          datetime,
          account_name,
          category_name,
          transaction_type,
        };

        if (transaction_type === "transfer") {
          requestData.destination_account_name = destination_account_name;
        }
        if (notes !== "") {
          requestData.notes = notes;
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

  let dateStr = readDatetime.replace(" ", "T");
  const newDate = Date.parse(dateStr);

  return (
    <>
      <div className="transaction-detail-modal-container">
        <div className="transaction-detail-modal">
          <div className="datetime-close">
            <div className="datetime">
              {new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
                .format(newDate)
                .replace(", ", " | ")}
            </div>
            <div
              className="modal-close-button"
              onClick={onClose}
              title="Close Modal"
            >
              X
            </div>
          </div>

          <div className="details-splitter-container">
            <div className="details-left">
              <div className="desc-cat">
                <div className="description">{readDescription}</div>
                <div className="category">{readCategory}</div>
              </div>
            </div>
            <div className="details-right">
              <div className="bal-type-acc">
                <div className="type">{readType}</div>
                <div className="balance">
                  {Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: readCurrency,
                  }).format(readAmount)}
                </div>
                <div>{readAccount}</div>
              </div>
            </div>
          </div>
          {readNotes !== "" ? (
            <div className="notes-container">{readNotes}</div>
          ) : (
            ""
          )}
          <div className="expanded-modal">
            {isExpanded ? (
              <div
                className="collapse-button"
                onClick={toggleExpansion}
                title="Collapse Modal"
              >
                {"<"}
              </div>
            ) : (
              <div
                className="expand-button"
                onClick={toggleExpansion}
                title="Expand Modal"
              >
                {">"}
              </div>
            )}
            {isExpanded ? (
              <form
                onSubmit={handleSubmit}
                className="transaction-form-container"
              >
                <input
                  className="edit-transaction-form-input"
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  required
                />
                <input
                  className="edit-transaction-form-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  required
                />
                <input
                  className="edit-transaction-form-input"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                />
                <input
                  className="edit-transaction-form-input"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes"
                />
                <input
                  className="edit-transaction-form-input"
                  type="text"
                  value={category_name}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  required
                />
                {linked_transaction === null && (
                  <select
                    className="edit-transaction-form-input"
                    type="text"
                    value={transaction_type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Transaction Type"
                    required
                  >
                    <optgroup label="Transaction Type">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      {linked_transaction !== null ? (
                        <option value="transfer">Transfer</option>
                      ) : (
                        ""
                      )}
                    </optgroup>
                  </select>
                )}
                {linked_transaction === null && (
                  <select
                    className="edit-transaction-form-input"
                    type="text"
                    value={account_name}
                    onChange={(e) => {
                      setAccount(e.target.value);
                      const selectedAccount = userAccounts?.find(
                        (account) => account.name === e.target.value,
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
                          .map((account, index) => (
                            <option key={index} value={account.name}>
                              {account.name} ({account.currency})
                            </option>
                          ))}
                    </optgroup>
                  </select>
                )}
                {transaction_type === "transfer" &&
                  linked_transaction === null && (
                    <select
                      className="edit-transaction-form-input"
                      type="text"
                      value={destination_account_name}
                      onChange={(e) => setDestAccount(e.target.value)}
                    >
                      <optgroup label="Destination Account">
                        <option>- Select Destination Account -</option>
                        {userAccounts &&
                          Array.isArray(userAccounts) &&
                          [...userAccounts]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((account, index) =>
                              account.currency === currency &&
                              account_name !== account.name ? (
                                <option key={index} value={account.name}>
                                  {account.name} ({account.currency})
                                </option>
                              ) : null,
                            )}
                      </optgroup>
                    </select>
                  )}
                <button
                  className="edit-transaction-form-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "LOADING..." : "Update Transaction"}
                </button>
                <hr></hr>
                <button
                  className="delete-transaction-form-button"
                  onClick={() => setMethod("delete")}
                  type="submit"
                  disabled={loadingB}
                >
                  {loadingB ? "LOADING..." : "Delete Transaction"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
export default TransactionDetail;
