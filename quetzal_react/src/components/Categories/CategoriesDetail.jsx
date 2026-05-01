import api from "../../api";
import { useState, useEffect } from "react";
import "../../styles/Categories/CategoriesTable.css";

const CategoriesDetail = ({
  searchTerm,
  categoryName,
  startDate,
  endDate,
  account,
  currency,
  onNet,
  // detailsRowClick,
  // transDetailRefresher,
}) => {
  const [accTransactionData, setAccTransactionData] = useState([]);
  const [sortHeader, setSortHeader] = useState({
    key: "datetime",
    direction: "desc",
  });

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        api.get("transactions/", {
          params: {
            category: categoryName,
            start_date: startDate,
            end_date: endDate,
            account: account,
            currency: currency,
          },
        }),
        // Used to send balance affected by filters to Categories.jsx
        api.get("transactions/aggregate", {
          params: {
            category: categoryName,
            start_date: startDate,
            end_date: endDate,
            account: account,
            currency: currency,
          },
        }),
      ])
        .then(([transactionsRes, aggregateRes]) => {
          setAccTransactionData(transactionsRes.data);

          if (onNet && aggregateRes.data?.net !== undefined) {
            let net = aggregateRes.data.net;
            if (net < 0) {
              net *= -1;
            }
            onNet(net);
          }
        })
        .catch((err) => alert(err));
    };

    fetchData();
  }, [categoryName, startDate, endDate, account, currency]);

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

    if (sortHeader.key === "amount") {
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
          </tr>
          {sortedData.map((val, key) => {
            return (
              <tr
                // onClick={() =>
                //   detailsRowClick(
                //     val.id,
                //     val.datetime,
                //     val.description,
                //     val.notes,
                //     val.amount,
                //     val.category,
                //     val.account,
                //     val.currency,
                //     val.transaction_type,
                //     val.linked_transaction,
                //   )
                // }
                key={key}
              >
                <td style={{ width: 150 }}>{val.datetime}</td>
                <td style={{ width: 150 }}>{val.amount}</td>
                <td>{val.description}</td>
                <td>{val.account}</td>
                <td
                  style={{
                    width: 50,
                  }}
                >
                  {val.currency}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesDetail;
