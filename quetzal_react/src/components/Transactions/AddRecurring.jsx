import { useEffect, useState } from "react";
import api from "../../api";
import styles from "../../styles/Transactions/AddRecurring.module.css";

function AddRecurring({ route, onSuccess, onClose }) {
  const [start_date, setstart_date] = useState("");
  const [end_date, setend_date] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [transaction_type, setType] = useState("income");
  const [account, setAccount] = useState("");
  const [destinationAccount, setDestinationAccount] = useState("");
  const [currency, setCurrency] = useState("");
  const [userAccounts, setUserAccounts] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserAccounts = () => {
    Promise.all([api.get("accounts/"), api.get("categories/")])
      .then(([accRes, catRes]) => {
        setUserAccounts(accRes.data);
        setUserCategories(catRes.data);
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

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData;

      requestData = {
        start_date,
        end_date,
        frequency,
        amount,
        description,
        category,
        transaction_type,
        account,
        currency,
      };

      if (transaction_type === "transfer") {
        requestData.destination_account = destinationAccount;
      }
      if (notes !== "") {
        requestData.notes = notes;
      }

      const res = await api.post(route, requestData);

      if (res.status === 201) {
        alert("Transaction created successfully!");

        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
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
      setLoading(false);
    }
  };

  return (
    <div className={styles["add-recurring-modal"]}>
      <form
        onSubmit={handleSubmit}
        className={styles["add-recurring-form-container"]}
        id="divListen"
      >
        <div className={styles["modal-title-container"]}>
          <div className={styles["modal-title"]}>Add Recurring Transaction</div>
          <div
            className={styles["modal-close-button"]}
            onClick={onClose}
            title="Close Modal"
          >
            X
          </div>
        </div>
        <div className={styles["modal-label-container"]}>
          <label className={styles["modal-label"]}>Start Date</label>
          <label className={styles["modal-label"]}>End Date</label>
        </div>
        <div className={styles["add-recurring-form-input-container"]}>
          <input
            className={styles["add-recurring-form-input"]}
            type="datetime-local"
            value={start_date}
            onChange={(e) => setstart_date(e.target.value)}
            required
          />
          <input
            className={styles["add-recurring-form-input"]}
            type="datetime-local"
            value={end_date}
            onChange={(e) => setend_date(e.target.value)}
            required
          />
        </div>
        <select
          className={styles["add-recurring-form-input"]}
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
          className={styles["add-recurring-form-input"]}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          className={styles["add-recurring-form-input"]}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          className={styles["add-recurring-form-input"]}
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />
        <input
          list="categories"
          className={styles["add-recurring-form-input"]}
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <datalist id="categories">
          {userCategories &&
            Array.isArray(userCategories) &&
            [...userCategories]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
        </datalist>
        <select
          className={styles["add-recurring-form-input"]}
          type="text"
          value={transaction_type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Transaction Type"
          required
        >
          <optgroup label="Transaction Type">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </optgroup>
        </select>
        <select
          className={styles["add-recurring-form-input"]}
          type="text"
          value={account}
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
        {transaction_type === "transfer" && (
          <select
            className={styles["add-recurring-form-input"]}
            type="text"
            value={destinationAccount}
            onChange={(e) => {
              const selectedAccount = userAccounts?.find(
                (account) => account.name === e.target.value,
              );
              setDestinationAccount(e.target.value);
              setDescription(
                `To: ${e.target.value} (${selectedAccount.currency})`,
              );
            }}
          >
            <optgroup label="Destination Account">
              <option>- Select Destination Account -</option>
              {userAccounts &&
                Array.isArray(userAccounts) &&
                [...userAccounts]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((arrayAccount, index) =>
                    arrayAccount.currency === currency &&
                    account !== arrayAccount.name ? (
                      <option key={index} value={arrayAccount.name}>
                        {arrayAccount.name} ({arrayAccount.currency})
                      </option>
                    ) : null,
                  )}
            </optgroup>
          </select>
        )}
        <button
          className={styles["add-recurring-form-button"]}
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Add Recurring Transaction"}
        </button>
      </form>
    </div>
  );
}

export default AddRecurring;
