import api from "../api";
import { useState } from "react";
import { useEffect } from "react";
import "../styles/AccountsTable.css";

const AccountsTable = () => {
  const [tableData, setTableData] = useState([]);

  const getTableData = () => {
    api
      .get("accounts/")
      .then((res) => res.data)
      .then((data) => {
        setTableData(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <div>
      <table className="accounts-table">
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Currency</th>
          <th>Balance</th>
        </tr>
        {tableData.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td style={{ textTransform: "capitalize" }}>{val.type}</td>
              <td>{val.currency}</td>
              <td>{val.balance}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default AccountsTable;
