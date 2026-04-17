import { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/Transactions/AddTransaction.css";
import "../../styles/Transactions/TransactionForm.css";

function AddTransaction({ route, onSuccess, onClose }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [datetime, setDatetime] = useState("");
  const [account_name, setAccount] = useState("");
  const [destination_account_name, setDestAccount] = useState("");
  const [category_name, setCategory] = useState("");
  const [transaction_type, setType] = useState("income");
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
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData;

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

      const res = await api.post(route, requestData);

      if (res.status === 201) {
        alert("Transaction created successfully!");

        setAmount("");
        setCurrency("");
        setDescription("");
        setDatetime("");
        setAccount("");
        setDestAccount("");
        setCategory("");

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
    <div className="add-transaction-modal">
      <form onSubmit={handleSubmit} className="add-transaction-form-container">
        <div className="modal-title-container">
          <div className="modal-title">Add Transaction</div>
          <div
            className="modal-close-button"
            onClick={onClose}
            title="Close Modal"
          >
            X
          </div>
        </div>
        <input
          className="add-transaction-form-input"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
        <input
          className="add-transaction-form-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          className="add-transaction-form-input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          className="add-transaction-form-input"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />
        <input
          list="categories"
          className="add-transaction-form-input"
          type="text"
          value={category_name}
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
          className="add-transaction-form-input"
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
          className="add-transaction-form-input"
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
        {transaction_type === "transfer" && (
          <select
            className="add-transaction-form-input"
            type="text"
            value={destination_account_name}
            onChange={(e) => {
              const selectedAccount = userAccounts?.find(
                (account) => account.name === e.target.value,
              );
              setDestAccount(e.target.value);
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
          className="add-transaction-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;
