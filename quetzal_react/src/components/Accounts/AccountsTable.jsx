import { useState } from "react";
import styles from "../../styles/Table.module.css";

const AccountsTable = ({
  onRowClick,
  searchTerm,
  currencyFilter,
  accountsData,
}) => {
  const [sortHeader, setSortHeader] = useState({
    key: "name",
    direction: "asc",
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortHeader.key === key && sortHeader.direction === "asc") {
      direction = "desc";
    }
    setSortHeader({ key, direction });
  };

  const filteredData = accountsData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCurrency = !currencyFilter || item.currency === currencyFilter;
    return matchesSearch && matchesCurrency;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortHeader.key) return 0;

    let aValue = a[sortHeader.key];
    let bValue = b[sortHeader.key];

    if (sortHeader.key === "balance") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);

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
          <th className={styles.th} onClick={() => requestSort("name")}>
            Name{" "}
            {sortHeader.key === "name"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("type")}>
            Type{" "}
            {sortHeader.key === "type"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("currency")}>
            Currency{" "}
            {sortHeader.key === "currency"
              ? sortHeader.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th className={styles.th} onClick={() => requestSort("balance")}>
            Balance{" "}
            {sortHeader.key === "balance"
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
                onRowClick(val.id, val.name, val.type, val.currency)
              }
              key={key}
            >
              <td className={styles.td}>{val.name}</td>
              <td className={styles.td}>{val.type}</td>
              <td className={styles.td}>{val.currency}</td>
              <td className={styles.td}>{val.balance}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AccountsTable;
