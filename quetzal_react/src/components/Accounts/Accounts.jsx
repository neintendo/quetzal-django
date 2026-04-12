import "../../styles/Accounts/Accounts.css";
import api from "../../api";
import { useState, useEffect } from "react";
import AccountsDetail from "./AccountsDetail";
import AccountsGraph from "./AccountsGraph";
import AccountsTable from "../Accounts/AccountsTable";
import AddAccount from "./AddAccount";
import EditAccount from "./EditAccount";
import TransactionDetail from "../Transactions/TransactionDetail";

const Accounts = () => {
  const [accountAggregates, setAccountAggregates] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [tableNav, setTableNav] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedAccountName, setSelectedAccountName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [selectedAccountCurrency, setSelectedAccountCurrency] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAccEditModal, setShowAccEditModal] = useState(false);
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

  const [graphMax, setGraphMax] = useState(false);
  const [graphMin, setGraphMin] = useState(true);
  const [tableMax, setTableMax] = useState(false);
  const [tableMin, setTableMin] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get("accounts/aggregate/"),
      api.get("profile/"),
      api.get("accounts/"),
    ])
      .then(([aggregatesRes, profileRes, accountsRes]) => {
        setAccountAggregates(aggregatesRes.data);
        setProfile(profileRes.data);
        setAccountsData(accountsRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => {
    fetchData();
  };

  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency:
      currencyFilter != null
        ? currencyFilter || "USD"
        : profile?.main_currency || "USD", // USD is just a fallback
  });

  const currencyAggregate = accountsData
    .filter((account) => account.currency === currencyFilter)
    .map((account) => parseFloat(account.balance));

  const selectedCurrencySum = currencyAggregate.reduce(
    (total, sum) => total + sum,
    0,
  );

  const uniqueCurrencies = [
    ...new Set(accountsData.map((account) => account.currency)),
  ].sort();

  const divCurrencies = uniqueCurrencies.map((currency) => (
    <div
      className="accounts-graph-balance-list"
      onClick={() => {
        setCurrencyFilter(currency);
        setTableNav(false);
        setSelectedAccount();
      }}
    >
      {currency}
    </div>
  ));

  const handleAccountAdded = () => {
    setShowAddModal(false);
    refresh();
  };

  const handleAccountEdited = () => {
    setShowAccEditModal(false);
    setSelectedAccount("");
    refresh();
    setTableNav(false);
  };

  const handleAccountDelete = () => {
    setTableNav(false);
  };

  const handleRowClick = (
    accountIdFromChild,
    accountNameFromChild,
    accountTypeFromChild,
    currencyFromChild,
  ) => {
    setSelectedAccount(accountIdFromChild);
    setSelectedAccountName(accountNameFromChild);
    setSelectedAccountType(accountTypeFromChild);
    setSelectedAccountCurrency(currencyFromChild);
    setTableNav(true);
  };

  const detailsRowClick = (
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

  const accountDetailBalance = accountsData.find(
    (account) => account.id === selectedAccount,
  );

  const toggleGraphMax = () => {
    setGraphMax(!graphMax);
  };

  const toggleGraphMin = () => {
    setGraphMin(!graphMin);
  };

  const toggleTableMax = () => {
    setTableMax(!tableMax);
  };

  const toggleTableMin = () => {
    setTableMin(!tableMin);
  };

  return (
    <>
      {showAddModal && (
        <AddAccount
          route="/accounts/"
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAccountAdded}
        />
      )}
      {showAccEditModal && (
        <EditAccount
          route={`/accounts/${selectedAccount}/`}
          onClose={() => setShowAccEditModal(false)}
          onSuccess={handleAccountEdited}
          account={selectedAccountName}
          accountType={selectedAccountType}
          accountCurrency={selectedAccountCurrency}
          onAccountDelete={handleAccountDelete}
        />
      )}
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
      <div className="accounts">
        {graphMin ? (
          <div
            className={graphMax ? "accounts-graph-max" : "accounts-graph"}
            onDoubleClick={() => {
              toggleGraphMax();
              toggleTableMin();
            }}
          >
            <div
              className={
                currencyFilter || tableNav
                  ? "accounts-graph-balance-container-active"
                  : "accounts-graph-balance-container"
              }
              title={currencyFilter || tableNav ? "Reset Currency Filter" : ""}
            >
              <div
                className="accounts-graph-balance"
                onClick={() => {
                  setCurrencyFilter(null);
                  setTableNav(false);
                  setSelectedAccount();
                }}
              >
                {tableNav
                  ? new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: accountDetailBalance.currency,
                    }).format(accountDetailBalance.balance)
                  : currencyFilter
                    ? currencyFormatter.format(selectedCurrencySum)
                    : accountAggregates?.accounts_converted != 0
                      ? `± ${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`
                      : `${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`}
              </div>
              <div>{divCurrencies}</div>
            </div>
            <AccountsGraph
              currencyFilter={currencyFilter}
              selectedAccount={selectedAccount}
            />
          </div>
        ) : (
          ""
        )}
        {tableMin ? (
          <div className="accounts-table-container">
            <div className="accounts-table-header">
              {tableNav ? (
                <div
                  onClick={() => {
                    setTableNav(false);
                    setSelectedAccount();
                  }}
                  className="accounts-table-title-active"
                  title="Navigate Back"
                >
                  {selectedAccountName}
                </div>
              ) : (
                <div
                  className="accounts-table-title"
                  onDoubleClick={() => {
                    (toggleTableMax(), toggleGraphMin());
                  }}
                  title="Double Click to Minimise / Maximise"
                >
                  {" "}
                  Accounts
                </div>
              )}
              <input
                className="table-header-input"
                placeholder={
                  tableNav ? `Search ${selectedAccountName}` : "Search Account"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="table-header-button-container">
                {tableNav ? (
                  <div className="edit-account-container">
                    <button
                      className="edit-account-button"
                      type="button"
                      onClick={() => setShowAccEditModal(true)}
                    >
                      {"Edit Account"}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {tableNav ? (
                  ""
                ) : (
                  <div className="add-account-container">
                    <button
                      className="add-account-button"
                      type="button"
                      onClick={() => setShowAddModal(true)}
                    >
                      {"+ Add Account"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              {/* If tableNav is true switch page to account AccountsDetail*/}
              {tableNav ? (
                <AccountsDetail
                  searchTerm={searchTerm}
                  accountName={selectedAccountName}
                  detailsRowClick={detailsRowClick}
                />
              ) : (
                <AccountsTable
                  onRowClick={handleRowClick}
                  searchTerm={searchTerm}
                  currencyFilter={currencyFilter}
                  accountsData={accountsData}
                />
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Accounts;
