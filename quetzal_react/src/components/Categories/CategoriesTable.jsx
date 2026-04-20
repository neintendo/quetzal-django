import { useState } from "react";
import "../../styles/Categories/CategoriesTable.css";

const CategoriesTable = ({ searchTerm, categoriesData }) => {
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

  const filteredData = categoriesData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
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
    <div>
      <table>
        <tbody>
          <tr>
            <th onClick={() => requestSort("name")}>
              Name{" "}
              {sortHeader.key === "name"
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
                //   onRowClick(val.id, val.name, val.type, val.currency)
                // }
                key={key}
              >
                <td>{val.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
