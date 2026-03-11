import "../styles/Accounts.css";
import api from "../api";
import { useState } from "react";
import { useEffect } from "react";

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
          <div className="accounts-table-header">Accounts</div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
