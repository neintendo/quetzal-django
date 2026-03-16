import "../styles/Accounts.css";
import api from "../api";
import { useState, useEffect } from "react";
import AccountsTable from "./AccountsTable";

const Accounts = () => {
  const [accountAggregates, setAccountAggregates] = useState(null);
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
            />
          </div>
          <div>
            <AccountsTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
