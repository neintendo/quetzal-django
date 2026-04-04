import "../../styles/Accounts/Accounts.css";
import api from "../../api";
import { useState, useEffect } from "react";
import AccountsDetail from "./AccountsDetail";
import AccountsGraph from "./AccountsGraph";
import AccountsTable from "../Accounts/AccountsTable";
import AddAccount from "./AddAccount";
import EditAccount from "./EditAccount";

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
  ];

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
    refresh();
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

  const accountDetailBalance = accountsData.find(
    (account) => account.id === selectedAccount,
  );

  const handleAccountDelete = () => {
    setTableNav(false);
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
      <div className="accounts">
        <div className="accounts-graph">
          <div
            className={
              currencyFilter || tableNav
                ? "accounts-graph-balance-container-active"
                : "accounts-graph-balance-container"
            }
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
        <div className="accounts-table-container">
          <div className="accounts-table-header">
            {tableNav ? (
              <div
                onClick={() => {
                  setTableNav(false);
                  setSelectedAccount();
                }}
                className="accounts-table-title-active"
              >
                {selectedAccountName}
              </div>
            ) : (
              <div className="accounts-table-title"> Accounts</div>
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
      </div>
    </>
  );
};

export default Accounts;
