import { useState } from "react";
import "../../styles/Accounts/EditAccount.css";
import "../../styles/Accounts/EditAccountForm.css";
import api from "../../api";

function EditAccount({
  route,
  onSuccess,
  onClose,
  account,
  accountType,
  accountCurrency,
  onAccountDelete,
}) {
  const [name, setName] = useState(account);
  const [type, setType] = useState(accountType);
  const [currency, setCurrency] = useState(accountCurrency);
  const [method, setMethod] = useState("put");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (method === "delete") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this account? This action cannot be undone!",
      );
      if (!confirmed) {
        setLoading(false);
        return;
      }
    }

    try {
      let requestData;

      if (method === "put") {
        requestData = { name, type, currency };
      }

      const res = await api[method](route, requestData);

      if (res.status === 200) {
        alert("Account updated successfully!");
        setName(name);
        setType(type);
        setCurrency(currency);
      }
      if (res.status === 204) {
        alert("Account deleted successfully!");
        onAccountDelete();
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
      setLoading(false);
    }
  };

  return (
    <div className="edit-account-modal">
      <form onSubmit={handleSubmit} className="edit-account-form-container">
        <div className="modal-title-container">
          <div className="modal-title">Edit Account</div>
          <div className="modal-close-button" onClick={onClose}>
            X
          </div>
        </div>
        <input
          className="edit-account-form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="edit-account-form-input"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Account Type"
          required
        />
        <button
          className="edit-account-form-button"
          onClick={() => setMethod("put")}
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Update Account"}
        </button>
        <hr></hr>
        <button
          className="delete-account-form-button"
          onClick={() => setMethod("delete")}
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Delete Account"}
        </button>
      </form>
    </div>
  );
}

export default EditAccount;
