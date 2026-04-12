import "../../styles/Transactions/Transactions.css";
import api from "../../api";
import { useState, useEffect } from "react";
import TransactionsTable from "../Transactions/TransactionsTable";
import TransactionDetail from "./TransactionDetail";

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterView, setShowFilterView] = useState(false);
  const isFilterActive =
    startDate || endDate || account || category || currency || transactionType;
  const [showTransactionDetailModal, setShowTransactionDetailModal] =
    useState(false);
  const [selectedTransactionDatetime, setSelectedTransactionDatetime] =
    useState("");
  const [selectedTransactionDescription, setSelectedTransactionDescription] =
    useState("");
  const [selectedTransactionAmount, setSelectedTransactionAmount] =
    useState("");
  const [selectedTransactionCategory, setSelectedTransactionCategory] =
    useState("");
  const [selectedTransactionAccount, setSelectedTransactionAccount] =
    useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedTransactionCurrency, setSelectedTransactionCurrency] =
    useState("");

  const fetchData = () => {
    Promise.all([
      api.get("transactions/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          account: account,
          category: category,
          currency: currency,
          transaction_type: transactionType,
        },
      }),
    ])
      .then(([transactionsRes]) => {
        setTransactionsData(transactionsRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, account, category, currency, transactionType]);

  const uniqueAccounts = [
    ...new Set(transactionsData.map((transaction) => transaction.account)),
  ].sort();

  const uniqueCategories = [
    ...new Set(transactionsData.map((transaction) => transaction.category)),
  ].sort();

  const uniqueCurrencies = [
    ...new Set(transactionsData.map((transaction) => transaction.currency)),
  ].sort();

  const uniqueTypes = [
    ...new Set(
      transactionsData.map((transaction) => transaction.transaction_type),
    ),
  ].sort();

  const toggleFilterView = () => {
    setShowFilterView(!showFilterView);
  };

  const handleRowClick = (
    datetimeFromChild,
    descriptionFromChild,
    amountFromChild,
    categoryFromChild,
    accountFromChild,
    currencyFromChild,
    typeFromChild,
  ) => {
    setSelectedTransactionDatetime(datetimeFromChild);
    setSelectedTransactionDescription(descriptionFromChild);
    setSelectedTransactionAmount(amountFromChild);
    setSelectedTransactionCategory(categoryFromChild);
    setSelectedTransactionAccount(accountFromChild);
    setSelectedTransactionCurrency(currencyFromChild);
    setSelectedTransactionType(typeFromChild);
    setShowTransactionDetailModal(true);
  };

  return (
    <>
      {showTransactionDetailModal && (
        <TransactionDetail
          onClose={() => setShowTransactionDetailModal(false)}
          datetime={selectedTransactionDatetime}
          description={selectedTransactionDescription}
          amount={selectedTransactionAmount}
          category={selectedTransactionCategory}
          account={selectedTransactionAccount}
          currency={selectedTransactionCurrency}
          type={selectedTransactionType}
        />
      )}
      <div className="transactions">
        <div className="transactions-table-container">
          <div className="transactions-table-header">
            <div
              className={
                showFilterView
                  ? "transactions-table-title-container-expanded"
                  : isFilterActive
                    ? "transactions-table-title-container-active"
                    : "transactions-table-title-container"
              }
            >
              <div
                className="transactions-table-title"
                onClick={toggleFilterView}
                title="Click to open filters"
              >
                Transactions
              </div>
              <div className="transactions-table-filter-container">
                <div className="transactions-table-textselect-container">
                  <div className="transactions-table-filters-filter">
                    Date Range
                    {startDate ? (
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
                  <div className="transaction-table-start-end-date-container">
                    <input
                      className="transactions-table-filters-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    ></input>
                    <div style={{ fontSize: 11 }}>to </div>
                    <input
                      className="transactions-table-filters-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
                <div className="transactions-table-textselect-container">
                  <div className="transactions-table-filters-filter">
                    Account
                    {account ? (
                      <div
                        className="filter-clear-button"
                        onClick={() => {
                          setAccount("");
                        }}
                      >
                        X
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <select
                    className="transactions-table-filters-select"
                    type="text"
                    value={account}
                    onChange={(e) => {
                      setAccount(e.target.value);
                    }}
                  >
                    <option value="">- Select Account -</option>
                    {uniqueAccounts.map((account) => (
                      <option key={account} value={account}>
                        {account}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="transactions-table-textselect-container">
                  <div className="transactions-table-filters-filter">
                    Category
                    {category ? (
                      <div
                        className="filter-clear-button"
                        onClick={() => {
                          setCategory("");
                        }}
                      >
                        X
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <select
                    className="transactions-table-filters-select"
                    type="text"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    <option value="">- Select Category -</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="transactions-table-textselect-container">
                  <div className="transactions-table-filters-filter">
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
                    className="transactions-table-filters-select"
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
                <div className="transactions-table-textselect-container">
                  <div className="transactions-table-filters-filter">
                    Transaction Type
                    {transactionType ? (
                      <div
                        className="filter-clear-button"
                        onClick={() => {
                          setTransactionType("");
                        }}
                      >
                        X
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <select
                    className="transactions-table-filters-select"
                    type="text"
                    value={transactionType}
                    onChange={(e) => {
                      setTransactionType(e.target.value);
                    }}
                  >
                    <option value="">- Select Transaction Type -</option>
                    {uniqueTypes.map((transactionType) => (
                      <option
                        style={{ textTransform: "capitalize" }}
                        key={transactionType}
                        value={transactionType}
                      >
                        {transactionType.charAt(0).toUpperCase()}
                        {transactionType.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <input
              className="table-header-input"
              placeholder={"Search Transaction"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TransactionsTable
            transactionsData={transactionsData}
            searchTerm={searchTerm}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </>
  );
};

export default Transactions;
