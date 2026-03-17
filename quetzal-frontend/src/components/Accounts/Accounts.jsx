import "../../styles/Accounts.css";
import api from "../../api";
import { useState, useEffect } from "react";
import AccountsTable from "../Accounts/AccountsTable";
import AddAccount from "./AddAccount";

const Accounts = () => {
  const [accountAggregates, setAccountAggregates] = useState(null);
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

  const handleAccountAdded = () => {
    setShowAddModal(false);
    // add code for refreshing table here later
  };

  return (
    <>
      <div className="accounts">
        <div className="accounts-graph">
          <div className="accounts-graph-balance">
            ${accountAggregates?.total_balance ?? "..."}
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
              <button className="filter-accounts" type="button">
                {"▫"}
              </button>
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
