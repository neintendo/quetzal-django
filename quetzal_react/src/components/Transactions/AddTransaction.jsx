import { useState } from "react";
import api from "../../api";
import "../../styles/Transactions/AddTransaction.css";
import "../../styles/Transactions/TransactionForm.css";

function AddTransaction({ route, onSuccess, onClose }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [account_name, setAccount] = useState("");
  const [category_name, setCategory] = useState("");
  const [transaction_type, setType] = useState("");
  const [loading, setLoading] = useState(false);

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

      const res = await api.post(route, requestData);

      if (res.status === 201) {
        alert("Transaction created successfully!");

        setAmount("");
        setCurrency("");
        setDescription("");
        setDatetime("");
        setAccount("");
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
          <div className="modal-close-button" onClick={onClose}>
            X
          </div>
        </div>
        <input
          className="add-transaction-form-input"
          type="date"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          placeholder="Date"
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
          value={transaction_type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Transaction Type"
          required
        />
        <input
          className="add-transaction-form-input"
          type="text"
          value={category_name}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
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
          value={account_name}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Account"
          required
        />
        <input
          className="add-transaction-form-input"
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Currency"
          required
        />
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
