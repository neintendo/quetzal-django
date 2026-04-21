import { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/Categories/AddCategory.css";
import "../../styles/Categories/AddCategoryForm.css";

function AddCategory({ route, onSuccess, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

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

      requestData = { name, type };

      const res = await api.post(route, requestData);

      if (res.status === 201) {
        alert("Category created successfully!");

        setName("");
        setType("");

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
    <div className="add-category-modal">
      <form
        onSubmit={handleSubmit}
        className="add-category-form-container"
        id="divListen"
      >
        <div className="modal-title-container">
          <div className="modal-title">Add Category</div>
          <div
            className="modal-close-button"
            onClick={onClose}
            title="Close Modal"
          >
            X
          </div>
        </div>
        <input
          className="add-category-form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <select
          className="add-category-form-input"
          list="types"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type"
          required
        >
          <option>- Select Type -</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button
          className="add-category-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
