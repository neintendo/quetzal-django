import { useState } from "react";
import "../../styles/AddAccount.css";
import "../../styles/AddAccountForm.css";
import api from "../../api";

function AddAccount({ route, onSuccess, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData;

      requestData = { name, type, currency };

      const res = await api.post(route, requestData);

      if (res.status === 201) {
        alert("Account created successfully!");

        setName("");
        setType("");
        setCurrency("");

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
    <div className="add-account-modal">
      <form onSubmit={handleSubmit} className="add-account-form-container">
        <div className="modal-title-container">
          <div className="modal-title">Add Account</div>
          <div className="modal-close-button" onClick={onClose}>
            X
          </div>
        </div>
        <input
          className="add-account-form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="add-account-form-input"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type"
          required
        />
        <input
          className="add-account-form-input"
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Currency"
          required
        />
        <button
          className="add-account-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Add Account"}
        </button>
      </form>
    </div>
  );
}

export default AddAccount;
