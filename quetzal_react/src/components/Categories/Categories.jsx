import "../../styles/Categories/Categories.css";
import api from "../../api";
import { useState, useEffect } from "react";
import CategoriesTable from "./CategoriesTable";
import CategoriesDoughnut from "./CategoriesDoughnut";
import AddCategory from "./AddCategory";

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesGraphData, setCategoriesGraphData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [tableToggle, setTableToggle] = useState(false);
  const [categoryType, setCategoryType] = useState("expense");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showFilterView, setShowFilterView] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("");
  const isFilterActive = startDate || endDate || account || currency;

  const fetchData = () => {
    Promise.all([
      api.get("categories/", { params: { type: categoryType } }),
      api.get("categories/graph/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          account: account,
          currency: currency,
        },
      }),
      api.get("profile/"),
      api.get("transactions/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          account: account,
          currency: currency,
        },
      }),
    ])
      .then(
        ([categoriesRes, categoriesGraphRes, profileRes, transactionsRes]) => {
          setCategoriesData(categoriesRes.data);
          setCategoriesGraphData(categoriesGraphRes.data);
          setProfile(profileRes.data);
          setTransactionsData(transactionsRes.data);
        },
      )
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [categoryType, startDate, endDate, account, currency]);

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

  const uniqueAccounts = [
    ...new Map(
      transactionsData.map((t) => [
        `${t.account}|${t.currency}`,
        { account: t.account, currency: t.currency },
      ]),
    ).values(),
  ].sort((a, b) => a.account.localeCompare(b.account));

  const uniqueCurrencies = [
    ...new Set(transactionsData.map((transaction) => transaction.currency)),
  ].sort();

  const toggleFilterView = () => {
    setShowFilterView(!showFilterView);
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
        <div className="categories-doughnut">
          <div
            className={
              showFilterView
                ? "categories-doughnut-balance-container-expanded"
                : isFilterActive
                  ? "categories-doughnut-balance-container-active"
                  : "categories-doughnut-balance-container"
            }
          >
            <div
              className="categories-doughnut-balance"
              onClick={() => toggleFilterView()}
            >
              {categoriesGraphData.converted_transactions !== 0
                ? tableToggle
                  ? `± ${currencyFormatter.format(categoriesGraphData?.income_total) ?? "..."}`
                  : `± ${currencyFormatter.format(categoriesGraphData?.expenses_total * -1) ?? "..."}`
                : tableToggle
                  ? `${currencyFormatter.format(categoriesGraphData?.income_total) ?? "..."}`
                  : `${currencyFormatter.format(categoriesGraphData?.expenses_total * -1) ?? "..."}`}
            </div>
            <div
              className={
                showFilterView
                  ? "categories-filter-container-active"
                  : "categories-filter-container"
              }
            >
              <div
                className="categories-textselect-container"
                style={{ paddingLeft: 20 }}
              >
                <div className="categories-filters-filter">
                  Date Range
                  {startDate || endDate ? (
                    <div
                      className="filter-clear-button"
                      onClick={() => {
                        (setStartDate(""), setEndDate(""));
                      }}
                    >
                      X
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="categories-start-end-date-container">
                  <input
                    className="category-filters-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  ></input>
                  <div style={{ fontSize: 11 }}>to </div>
                  <input
                    className="category-filters-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="categories-textselect-container">
                <div className="categories-filters-filter">
                  Account
                  {account ? (
                    <div
                      className="filter-clear-button"
                      onClick={() => {
                        setAccount("");
                        setCurrency("");
                      }}
                    >
                      X
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <select
                  className="categories-filters-select"
                  type="text"
                  value={account}
                  onChange={(e) => {
                    {
                      const selectedAccount = uniqueAccounts.find(
                        (item) => item.account === e.target.value,
                      );
                      setAccount(e.target.value);
                      setCurrency(selectedAccount?.currency || "");
                    }
                  }}
                >
                  <option value="">- Select Account -</option>
                  {uniqueAccounts.map(({ account }) => (
                    <option key={account} value={account}>
                      {account}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="categories-textselect-container"
                style={{ paddingRight: 20 }}
              >
                <div className="categories-filters-filter">
                  Currency
                  {currency ? (
                    <div
                      className="filter-clear-button"
                      onClick={() => {
                        setCurrency("");
                      }}
                    >
                      X
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <select
                  className="categories-filters-select"
                  type="text"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                  }}
                >
                  <option value="">- Select Currency -</option>
                  {uniqueCurrencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <CategoriesDoughnut enhancedCategoriesData={enhancedCategoriesData} />
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
