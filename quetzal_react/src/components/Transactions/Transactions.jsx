import "../../styles/Transactions/Transactions.css";
import api from "../../api";
import { useState, useEffect } from "react";
import TransactionsTable from "../Transactions/TransactionsTable";

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = () => {
    Promise.all([api.get("transactions/")])
      .then(([transactionsRes]) => {
        setTransactionsData(transactionsRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="transactions">
        <div className="transactions-table-container">
          <div className="transactions-table-header">
            <div className="transactions-table-title">Transactions</div>
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
          />
        </div>
      </div>
    </>
  );
};

export default Transactions;
