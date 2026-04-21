import "../../styles/Categories/Categories.css";
import api from "../../api";
import { useState, useEffect } from "react";
import CategoriesTable from "./CategoriesTable";
import AddCategory from "./AddCategory";

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesGraphData, setCategoriesGraphData] = useState([]);
  const [tableToggle, setTableToggle] = useState(false);
  const [categoryType, setCategoryType] = useState("expense");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("");

  const fetchData = () => {
    Promise.all([
      api.get("categories/", { params: { type: categoryType } }),
      api.get("categories/graph/"),
      api.get("profile/"),
    ])
      .then(([categoriesRes, categoriesGraphRes, profileRes]) => {
        setCategoriesData(categoriesRes.data);
        setCategoriesGraphData(categoriesGraphRes.data);
        setProfile(profileRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [categoryType]);

  const refresh = () => {
    fetchData();
  };

  const enhancedCategoriesData = categoriesData.map((category) => {
    let total = 0;

    if (category.type === "expense") {
      total =
        categoriesGraphData?.transactions_by_category?.expenses?.[
          category.name
        ] * -1 || 0;
    } else if (category.type === "income") {
      total =
        categoriesGraphData?.transactions_by_category?.income?.[
          category.name
        ] || 0;
    }

    return {
      ...category,
      total: total,
    };
  });

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency:
      currency != "" ? currency || "USD" : profile?.main_currency || "USD", // USD is just a fallback
  });

  const toggleTable = () => {
    setTableToggle(!tableToggle);
    setCategoryType(categoryType === "expense" ? "income" : "expense");
  };

  const handleCategoryAdded = () => {
    setShowAddModal(false);
    refresh();
  };

  return (
    <>
      {showAddModal && (
        <AddCategory
          route="/categories/"
          onClose={() => setShowAddModal(false)}
          onSuccess={handleCategoryAdded}
        />
      )}
      <div className="categories">
        <div className="categories-chart">
          <div className="categories-chart-balance-container">
            <div className="categories-chart-balance">
              {categoriesGraphData.converted_transactions !== 0
                ? tableToggle
                  ? `± ${currencyFormatter.format(categoriesGraphData?.income_total) ?? "..."}`
                  : `± ${currencyFormatter.format(categoriesGraphData?.expenses_total * -1) ?? "..."}`
                : tableToggle
                  ? `${currencyFormatter.format(categoriesGraphData?.income_total) ?? "..."}`
                  : `${currencyFormatter.format(categoriesGraphData?.expenses_total * -1) ?? "..."}`}
            </div>
          </div>
        </div>
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
              <div className="edit-category-container">
                <button
                  className="edit-category-button"
                  type="button"
                  onClick={() => setShowAddModal(true)}
                >
                  {"+ Add Category"}
                </button>
              </div>
            </div>
          </div>
          <CategoriesTable
            searchTerm={searchTerm}
            enhancedCategoriesData={enhancedCategoriesData}
          />
        </div>
      </div>
    </>
  );
};

export default Categories;
