import { useState } from "react";
import "../../styles/Transactions/TransactionsTable.css";

const TransactionsTable = ({ transactionsData, searchTerm }) => {
  const [sortHeader, setSortHeader] = useState({
    key: "datetime",
    direction: "desc",
  });

  const currencyFilter = "";
  const requestSort = (key) => {
    let direction = "asc";
    if (sortHeader.key === key && sortHeader.direction === "asc") {
      direction = "desc";
    }
    setSortHeader({ key, direction });
  };

  const filteredData = transactionsData.filter((item) => {
    const matchesSearch = item.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCurrency = !currencyFilter || item.currency === currencyFilter;
    return matchesSearch && matchesCurrency;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortHeader.key) return 0;

    let aValue = a[sortHeader.key];
    let bValue = b[sortHeader.key];

    if (sortHeader.key === "amount") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (aValue < bValue) {
      return sortHeader.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortHeader.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th onClick={() => requestSort("datetime")}>
              Date & Time{" "}
              {sortHeader.key === "datetime"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("description")}>
              Description{" "}
              {sortHeader.key === "description"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("amount")}>
              Amount{" "}
              {sortHeader.key === "amount"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("category")}>
              Category{" "}
              {sortHeader.key === "category"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("account")}>
              Account{" "}
              {sortHeader.key === "account"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("currency")}>
              Currency{" "}
              {sortHeader.key === "currency"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("transaction_type")}>
              Type{" "}
              {sortHeader.key === "transaction_type"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
          </tr>
          {sortedData.map((val, key) => {
            return (
              <tr key={key}>
                <td style={{ width: 150 }}>{val.datetime}</td>
                <td>{val.description}</td>
                <td>{val.amount}</td>
                <td>{val.category}</td>
                <td>{val.account}</td>
                <td style={{ width: 96 }}>{val.currency}</td>
                <td style={{ textTransform: "capitalize", width: 70 }}>
                  {val.transaction_type}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
