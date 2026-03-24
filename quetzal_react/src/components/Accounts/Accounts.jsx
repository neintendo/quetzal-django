import "../../styles/Accounts.css";
import api from "../../api";
import { useState, useEffect } from "react";
import AccountsGraph from "./AccountsGraph";
import AccountsTable from "../Accounts/AccountsTable";
import AddAccount from "./AddAccount";

const Accounts = () => {
  const [accountAggregates, setAccountAggregates] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
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
  }, []);

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
      onClick={() => setCurrencyFilter(currency)}
    >
      {currency}
    </div>
  ));

  const handleAccountAdded = () => {
    setShowAddModal(false);
    // add code for refreshing table here later
  };

  return (
    <>
      <div className="accounts">
        <div className="accounts-graph">
          <div
            className={
              currencyFilter
                ? "accounts-graph-balance-container-active"
                : "accounts-graph-balance-container"
            }
          >
            <div
              className="accounts-graph-balance"
              onClick={() => setCurrencyFilter(null)}
            >
              {currencyFilter
                ? currencyFormatter.format(selectedCurrencySum)
                : accountAggregates?.accounts_converted != 0
                  ? `± ${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`
                  : `${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`}
            </div>
            <div>{divCurrencies}</div>
          </div>
          <AccountsGraph currencyFilter={currencyFilter} />
        </div>
        <div className="accounts-table-container">
          <div className="accounts-table-header">
            <div className="accounts-table-title">Accounts</div>
            <input
              className="table-header-input"
              placeholder="Search Account"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-header-button-container">
              <div className="add-account-container">
                <button
                  className="add-account-button"
                  type="button"
                  onClick={() => setShowAddModal(true)}
                >
                  {"+ Add Account"}
                </button>
                {showAddModal && (
                  <AddAccount
                    route="/accounts/"
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAccountAdded}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <AccountsTable
              searchTerm={searchTerm}
              currencyFilter={currencyFilter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
