import api from "../../api";
import { useState } from "react";
import { useEffect } from "react";
import "../../styles/Accounts/AccountsDetail.css";

const AccountsDetail = ({ searchTerm, accountName, detailsRowClick }) => {
  const [accTransactionData, setAccTransactionData] = useState([]);
  const [sortHeader, setSortHeader] = useState({
    key: "datetime",
    direction: "desc",
  });

  useEffect(() => {
    const getAccTransactionData = () => {
      api
        .get("transactions/", { params: { account: accountName } })
        .then((res) => res.data)
        .then((data) => {
          setAccTransactionData(data);
          console.log(data);
        })
        .catch((err) => alert(err));
    };

    getAccTransactionData();
  }, [accountName]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortHeader.key === key && sortHeader.direction === "asc") {
      direction = "desc";
    }
    setSortHeader({ key, direction });
  };

  const filteredData = accTransactionData.filter((item) => {
    const matchesSearch = item.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortHeader.key) return 0;

    let aValue = a[sortHeader.key];
    let bValue = b[sortHeader.key];

    if (
      sortHeader.key === "amount" ||
      sortHeader.key === "destination_account"
    ) {
      if (sortHeader.key === "amount") {
        aValue = parseFloat(aValue);
        a.transaction_type === "expense" ? (aValue *= -1) : aValue;
        bValue = parseFloat(bValue);
        b.transaction_type === "expense" ? (bValue *= -1) : bValue;
      }

      if (aValue < bValue) {
        return sortHeader.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortHeader.direction === "asc" ? 1 : -1;
      }
    } else {
      console.log(sortHeader.key);
      if (aValue.toLowerCase() < bValue.toLowerCase()) {
        return sortHeader.direction === "asc" ? -1 : 1;
      }
      if (aValue.toLowerCase() > bValue.toLowerCase()) {
        return sortHeader.direction === "asc" ? 1 : -1;
      }
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
            <th onClick={() => requestSort("amount")}>
              Amount{" "}
              {sortHeader.key === "amount"
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
            <th onClick={() => requestSort("category")}>
              Category{" "}
              {sortHeader.key === "category"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("transaction_type")}>
              Transaction Type{" "}
              {sortHeader.key === "transaction_type"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => requestSort("destination_account")}>
              Dest. Account{" "}
              {sortHeader.key === "destination_account"
                ? sortHeader.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
          </tr>
          {sortedData.map((val, key) => {
            return (
              <tr
                onClick={() =>
                  detailsRowClick(
                    val.datetime,
                    val.description,
                    val.amount,
                    val.category,
                    val.account,
                    val.currency,
                    val.transaction_type,
                  )
                }
                key={key}
              >
                <td style={{ width: 150 }}>{val.datetime}</td>
                <td style={{ width: 150 }}>
                  {val.transaction_type === "expense"
                    ? -val.amount
                    : val.amount}
                </td>
                <td>{val.description}</td>
                <td>{val.category}</td>
                <td
                  style={{
                    textTransform: "capitalize",
                    width: 200,
                  }}
                >
                  {val.transaction_type}
                </td>
                <td style={{ width: 150 }}>{val.destination_account}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsDetail;
