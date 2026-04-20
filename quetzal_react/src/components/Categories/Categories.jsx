import "../../styles/Categories/Categories.css";
import api from "../../api";
import { useState, useEffect } from "react";
import CategoriesTable from "./CategoriesTable";

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [tableToggle, setTableToggle] = useState(false);
  const [categoryType, setCategoryType] = useState("expense");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = () => {
    api
      .get("categories/", { params: { type: categoryType } })
      .then((categoriesRes) => {
        setCategoriesData(categoriesRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [categoryType]);

  const toggleTable = () => {
    setTableToggle(!tableToggle);
    setCategoryType(categoryType === "expense" ? "income" : "expense");
  };

  return (
    <>
      <div className="categories">
        <div className="categories-chart"></div>
        <div className="categories-table-container">
          <div className="categories-table-header">
            <div
              className="categories-table-title"
              onClick={() => {
                toggleTable();
                setSearchTerm("");
              }}
              // title="Double Click to Minimise / Maximise"
            >
              {tableToggle ? "Income" : "Expenses"}
            </div>
            <input
              className="table-header-input"
              placeholder={tableToggle ? "Search Income" : "Search Expenses"}
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
