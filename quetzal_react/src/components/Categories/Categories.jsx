import "../../styles/Categories/Categories.css";
import api from "../../api";
import { useState, useEffect } from "react";
import CategoriesTable from "./CategoriesTable";

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = () => {
    api
      .get("categories/")
      .then((categoriesRes) => {
        setCategoriesData(categoriesRes.data);
      })
      .catch((err) => alert(err));
  };

  console.log(categoriesData);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="categories">
        <div className="categories-chart"></div>
        <div className="categories-table-container">
          <div className="categories-table-header">
            <div
              className="categories-table-title"
              // title="Double Click to Minimise / Maximise"
            >
              Categories
            </div>
            <input
              className="table-header-input"
              // placeholder={
              //   tableNav ? `Search ${selectedAccountName}` : "Search Account"
              // }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-header-button-container">
              <div className="edit-account-container">
                <button className="edit-account-button" type="button">
                  {"+ Add Category"}
                </button>
              </div>
            </div>
          </div>
          <CategoriesTable
            searchTerm={searchTerm}
            categoriesData={categoriesData}
          />
        </div>
      </div>
    </>
  );
};

export default Categories;
