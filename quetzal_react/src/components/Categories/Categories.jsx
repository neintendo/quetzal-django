import "../../styles/Categories/Categories.css";
import api from "../../api";
import { useState, useEffect } from "react";
import CategoriesTable from "./CategoriesTable";
import CategoriesDoughnut from "./CategoriesDoughnut";
import CategoriesRadar from "./CategoriesRadar";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import CurrentMonth from "../Utilities/CurrentMonth";
import CategoriesDetail from "./CategoriesDetail";

const Categories = () => {
  const { currentMonth } = CurrentMonth();
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesGraphData, setCategoriesGraphData] = useState([]);
  const [categoriesRadarPrevData, setCategoriesRadarPrevData] = useState([]);
  const [categoriesRadarMonthData, setCategoriesRadarMonthData] = useState([]);
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
  const [selectedCategoryID, setSelectedCategoryID] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedCategoryTotal, setSelectedCategoryTotal] = useState("");
  const [tableNav, setTableNav] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      // Current month dataset for radar
      api.get("categories/graph/", {
        params: {
          start_date: currentMonth,
          account: account,
          currency: currency,
        },
      }),
      // Average dataset for radar
      api.get("categories/graph/", {
        params: {
          account: account,
          currency: currency,
          radar_check: "true",
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
        ([
          categoriesRes,
          categoriesGraphRes,
          categoriesRadarMonthRes,
          categoriesRadarPrevRes,
          profileRes,
          transactionsRes,
        ]) => {
          setCategoriesData(categoriesRes.data);
          setCategoriesGraphData(categoriesGraphRes.data);
          setCategoriesRadarMonthData(categoriesRadarMonthRes.data);
          setCategoriesRadarPrevData(categoriesRadarPrevRes.data);
          setProfile(profileRes.data);
          setTransactionsData(transactionsRes.data);
        },
      )
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [categoryType, startDate, endDate, account, currency]);

  useEffect(() => {
    function clickOutside(event) {
      const filterView = document.getElementById("filterListen");
      if (filterView && !filterView.contains(event.target)) {
        setShowFilterView(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

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

  const enhancedRadarData = categoriesData.map((category) => {
    let total = 0;

    if (category.type === "expense") {
      total =
        categoriesRadarMonthData?.transactions_by_category?.expenses?.[
          category.name
        ] * -1 || 0;
    } else if (category.type === "income") {
      total =
        categoriesRadarMonthData?.transactions_by_category?.income?.[
          category.name
        ] || 0;
    }

    return {
      ...category,
      total: total,
    };
  });

  const enhancedRadarPrevData = categoriesData.map((category) => {
    let total = 0;

    if (category.type === "expense") {
      total =
        categoriesRadarPrevData?.transactions_by_category?.expenses?.[
          category.name
        ] * -1 || 0;
    } else if (category.type === "income") {
      total =
        categoriesRadarPrevData?.transactions_by_category?.income?.[
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

  const handleCategoryEdited = () => {
    setShowEditModal(false);
    refresh();
  };

  const handleCategoryDelete = () => {
    setShowEditModal(false);
    setTableNav(false);
    setSelectedCategoryName(false);
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

  const handleRowClick = (
    idFromChild,
    categoryNameFromChild,
    totalFromChild,
  ) => {
    setSelectedCategoryID(idFromChild);
    setSelectedCategoryName(categoryNameFromChild);
    setSelectedCategoryTotal(totalFromChild);
    setSearchTerm("");
    setTableNav(true);
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
      {showEditModal && (
        <EditCategory
          route={`/categories/${selectedCategoryID}/`}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleCategoryEdited}
          onCategoryDelete={handleCategoryDelete}
          category={selectedCategoryName}
        />
      )}
      <div className="categories">
        <div className="chartjs-container">
          <div className="categories-doughnut">
            <CategoriesDoughnut
              enhancedCategoriesData={enhancedCategoriesData}
            />
          </div>
          <div className="categories-radar">
            <CategoriesRadar
              enhancedCategoriesData={enhancedCategoriesData}
              enhancedRadarData={enhancedRadarData}
              enhancedRadarPrevData={enhancedRadarPrevData}
            />
          </div>
        </div>
        <div className="categories-table-container">
          <div className="categories-table-header-container">
            <div className="categories-table-header">
              <div
                className={
                  tableNav
                    ? "categories-table-title-active"
                    : "categories-table-title"
                }
                onClick={() => {
                  if (!tableNav) {
                    toggleTable();
                    setSearchTerm("");
                  }
                }}
                // title="Double Click to Minimise / Maximise"
              >
                {tableNav ? (
                  <div onClick={() => setTableNav(false)}>
                    {selectedCategoryName}
                  </div>
                ) : tableToggle ? (
                  "Income"
                ) : (
                  "Expenses"
                )}
              </div>
              <div
                className={
                  showFilterView
                    ? "categories-balance-container-expanded"
                    : isFilterActive
                      ? "categories-balance-container-active"
                      : "categories-balance-container"
                }
                // id="filterListen"
              >
                <div
                  className="categories-balance"
                  onClick={() => toggleFilterView()}
                >
                  {tableNav
                    ? // Total for category detail
                      categoriesGraphData.converted_transactions !== 0
                      ? `± ${currencyFormatter.format(selectedCategoryTotal) ?? "..."}`
                      : `${currencyFormatter.format(selectedCategoryTotal) ?? "..."}`
                    : // Total for category table
                      categoriesGraphData.converted_transactions !== 0
                      ? tableToggle
                        ? `± ${currencyFormatter.format(categoriesGraphData?.income_total) ?? "..."}`
                        : `± ${currencyFormatter.format(categoriesGraphData?.expenses_total * -1) ?? "..."}`
                      : tableToggle
                        ? `${currencyFormatter.format(categoriesGraphData?.income_total) ?? "..."}`
                        : `${currencyFormatter.format(categoriesGraphData?.expenses_total * -1) ?? "..."}`}
                </div>
              </div>
              <input
                className="table-header-input"
                placeholder={
                  tableNav
                    ? `Search ${selectedCategoryName}`
                    : tableToggle
                      ? "Search Income"
                      : "Search Expenses"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="table-header-button-container">
                <div className="add-edit-category-container">
                  {tableNav ? (
                    <button
                      className="add-edit-category-button"
                      type="button"
                      onClick={() => setShowEditModal(true)}
                    >
                      {"Edit Category"}
                    </button>
                  ) : (
                    <button
                      className="add-edit-category-button"
                      type="button"
                      onClick={() => setShowAddModal(true)}
                    >
                      {"+ Add Category"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {showFilterView ? (
              <div className="categories-filter-container">
                <div
                  className="categories-textselect-container"
                  style={{ paddingLeft: 20 }}
                >
                  <div className="categories-filters-filter">Date Range:</div>
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
                <div className="categories-textselect-container">
                  <div className="categories-filters-filter">Account:</div>
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
                <div
                  className="categories-textselect-container"
                  style={{ paddingRight: 20 }}
                >
                  <div className="categories-filters-filter">Currency:</div>
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
              </div>
            ) : (
              ""
            )}
          </div>

          {tableNav ? (
            <CategoriesDetail
              searchTerm={searchTerm}
              categoryName={selectedCategoryName}
            />
          ) : (
            <CategoriesTable
              onRowClick={handleRowClick}
              searchTerm={searchTerm}
              enhancedCategoriesData={enhancedCategoriesData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
