import { useEffect, useState } from "react";
import "../../styles/Accounts/AddAccount.css";
import "../../styles/Accounts/AddAccountForm.css";
import currencyList from "../Utilities/CurrencyList";
import api from "../../api";

function AddAccount({ route, onSuccess, onClose, accountsData }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountTypes] = useState(accountsData);

  useEffect(() => {
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
      <form
        onSubmit={handleSubmit}
        className="add-account-form-container"
        id="divListen"
      >
        <div className="modal-title-container">
          <div className="modal-title">Add Account</div>
          <div
            className="modal-close-button"
            onClick={onClose}
            title="Close Modal"
          >
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
          list="types"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type"
          required
        />
        <datalist id="types">
          {accountTypes &&
            Array.isArray(accountTypes) &&
            [...new Set(accountTypes.map((account) => account.type))]
              .sort()
              .map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
        </datalist>
        <select
          className="add-account-form-input"
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option>- Select Currency -</option>
          {currencyList.map(([sym, name]) => (
            <option key={name} value={sym}>
              {sym} - {name}
            </option>
          ))}
        </select>
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
