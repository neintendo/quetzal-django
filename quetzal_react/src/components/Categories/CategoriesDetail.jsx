import api from "../../api";
import { useState, useEffect } from "react";
import "../../styles/Categories/CategoriesTable.css";

const CategoriesDetail = ({
  searchTerm,
  categoryName,
  // detailsRowClick,
  // transDetailRefresher,
}) => {
  const [accTransactionData, setAccTransactionData] = useState([]);
  const [sortHeader, setSortHeader] = useState({
    key: "datetime",
    direction: "desc",
  });

  useEffect(() => {
    const getAccTransactionData = () => {
      api
        .get("transactions/", { params: { category: categoryName } })
        .then((res) => res.data)
        .then((data) => {
          setAccTransactionData(data);
          console.log(data);
        })
        .catch((err) => alert(err));
    };

    getAccTransactionData();
  }, [categoryName]);

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
