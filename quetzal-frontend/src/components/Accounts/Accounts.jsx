import "../../styles/Accounts.css";
import api from "../../api";
import { useState, useEffect } from "react";
import AccountsTable from "../Accounts/AccountsTable";
import AddAccount from "./AddAccount";

const Accounts = () => {
  const [accountAggregates, setAccountAggregates] = useState(null);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const getAccountAggregates = () => {
    api
      .get("accounts/aggregate/")
      .then((res) => res.data)
      .then((data) => {
        setAccountAggregates(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getAccountAggregates();
  }, []);

  const getProfile = () => {
    api
      .get("profile/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getProfile();
  }, []);

  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: profile?.main_currency || "USD", // USD is just a fallback
  });

  const handleAccountAdded = () => {
    setShowAddModal(false);
    // add code for refreshing table here later
  };

  return (
    <>
      <div className="accounts">
        <div className="accounts-graph">
          <div className="accounts-graph-balance">
            {accountAggregates?.accounts_converted != 0
              ? `± ${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`
              : `${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`}
          </div>
          <div></div>
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
              <div className="filter-account-container">
                <button className="filter-accounts" type="button">
                  {"▫"}
                </button>
              </div>
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
            <AccountsTable searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
