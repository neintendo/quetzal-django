import api from "../../api";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GlobalRefresh } from "../Utilities/GlobalRefresh";
import styles from "../../styles/Table.module.css";

const AccountsDetail = ({
  searchTerm,
  accountName,
  detailsRowClick,
  transDetailRefresher,
}) => {
  // Re-fetch data when GlobalRefresh.trigger is called elsewhere
  const globalRefresh = useSyncExternalStore(
    GlobalRefresh.subscribe,
    GlobalRefresh.getSnapshot,
  );
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
        })
        .catch((err) => alert(err));
    };

    getAccTransactionData();
  }, [globalRefresh, accountName, transDetailRefresher]);

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
    <table className={styles.table}>
      <tbody className={styles.tbody}>
        <tr className={styles.tr}>
          <th className={styles.th} onClick={() => requestSort("datetime")}>
            Date & Time{" "}
            {sortHeader.key === "datetime"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("amount")}>
            Amount{" "}
            {sortHeader.key === "amount"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("description")}>
            Description{" "}
            {sortHeader.key === "description"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("category")}>
            Category{" "}
            {sortHeader.key === "category"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th
            className={styles.th}
            onClick={() => requestSort("transaction_type")}
          >
            Transaction Type{" "}
            {sortHeader.key === "transaction_type"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
        </tr>
        {sortedData.map((val, key) => {
          return (
            <tr
              className={styles.tr}
              onClick={() =>
                detailsRowClick(
                  val.id,
                  val.datetime,
                  val.description,
                  val.notes,
                  val.amount,
                  val.category,
                  val.account,
                  val.currency,
                  val.transaction_type,
                  val.linked_transaction,
                )
              }
              key={key}
            >
              <td className={styles.td} style={{ width: 150 }}>
                {val.datetime}
              </td>
              <td className={styles.td} style={{ width: 150 }}>
                {val.transaction_type === "expense" ? -val.amount : val.amount}
              </td>
              <td className={styles.td}>{val.description}</td>
              <td className={styles.td}>{val.category}</td>
              <td
                className={styles.td}
                style={{
                  textTransform: "capitalize",
                  width: 200,
                }}
              >
                {val.transaction_type}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AccountsDetail;
