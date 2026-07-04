import { useState } from "react";
import styles from "../../styles/Table.module.css";

const RecurringTable = ({ recurringData, searchTerm, onRowClick }) => {
  const [sortHeader, setSortHeader] = useState({
    key: "start_date",
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

  const filteredData = recurringData.filter((item) => {
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
    <table className={styles.table}>
      <tbody className={styles.tbody}>
        <tr className={styles.tr}>
          <th className={styles.th} onClick={() => requestSort("start_date")}>
            Start Date{" "}
            {sortHeader.key === "start_date"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("end_date")}>
            End Date{" "}
            {sortHeader.key === "end_date"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("frequency")}>
            Frequency{" "}
            {sortHeader.key === "frequency"
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
          <th className={styles.th} onClick={() => requestSort("amount")}>
            Amount{" "}
            {sortHeader.key === "amount"
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
          <th className={styles.th} onClick={() => requestSort("account")}>
            Account{" "}
            {sortHeader.key === "account"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th
            className={styles.th}
            onClick={() => requestSort("destination_account")}
          >
            Dest. Account{" "}
            {sortHeader.key === "destination_account"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th
            className={styles.th}
            onClick={() => requestSort("transaction_type")}
          >
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
            <tr
              className={styles.tr}
              onClick={() =>
                onRowClick(
                  val.id,
                  val.start_date,
                  val.end_date,
                  val.frequency,
                  val.description,
                  val.notes,
                  val.amount,
                  val.category,
                  val.account,
                  val.destination_account,
                  val.currency,
                  val.transaction_type,
                )
              }
              key={key}
            >
              <td className={styles.td} style={{ width: 150 }}>
                {val.start_date}
              </td>
              <td className={styles.td} style={{ width: 150 }}>
                {val.end_date}
              </td>
              <td className={styles.td} style={{ textTransform: "capitalize" }}>
                {val.frequency.toLowerCase()}
              </td>
              <td className={styles.td}>{val.description}</td>
              <td className={styles.td}>{val.amount}</td>
              <td className={styles.td}>{val.category}</td>
              <td className={styles.td}>{val.account}</td>
              <td className={styles.td}>{val.destination_account}</td>
              <td
                className={styles.td}
                style={{ textTransform: "capitalize", width: 70 }}
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

export default RecurringTable;
