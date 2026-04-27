import { useEffect, useState } from "react";
import "../../styles/Categories/EditCategory.css";
import "../../styles/Categories/EditCategoryForm.css";
import api from "../../api";

function EditCategory({
  route,
  onSuccess,
  onClose,
  category,
  onCategoryDelete,
}) {
  const [name, setName] = useState(category);
  const [method, setMethod] = useState("put");
  const [loading, setLoading] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

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
    {
      method === "delete" ? setLoadingB(true) : setLoading(true);
    }
    e.preventDefault();

    if (method === "delete") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone!",
      );
      if (!confirmed) {
        setLoadingB(false);
        return;
      }
    }

    try {
      let requestData;

      if (method === "put") {
        requestData = { name };
      }

      const res = await api[method](route, requestData);

      if (res.status === 200) {
        alert("Category updated successfully!");
        setName(name);
      }
      if (res.status === 204) {
        alert("Category deleted successfully!");
        onCategoryDelete();
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

  return (
    <div className="edit-category-modal">
      <form
        onSubmit={handleSubmit}
        className="edit-category-form-container"
        id="divListen"
      >
        <div className="modal-title-container">
          <div className="modal-title">Edit Category</div>
          <div
            className="modal-close-button"
            onClick={onClose}
            title="Close Modal"
          >
            X
          </div>
        </div>
        <input
          className="edit-category-form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <button
          className="edit-category-form-button"
          onClick={() => setMethod("put")}
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Update Category"}
        </button>
        <hr></hr>
        <button
          className="delete-category-form-button"
          onClick={() => setMethod("delete")}
          type="submit"
          disabled={loadingB}
        >
          {loadingB ? "LOADING..." : "Delete Category"}
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
