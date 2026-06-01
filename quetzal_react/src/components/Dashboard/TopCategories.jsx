import styles from "../../styles/Dashboard/TopCategoriesTable.module.css";

const TopCategories = ({ enhancedCategoriesData }) => {
  return (
    <table className={styles.table}>
      <tbody className={styles.tbody}>
        <tr className={styles.tr}>
          <th className={styles.th}>Name </th>
          <th className={styles.th}>Total </th>
          <th className={styles.th}>Type </th>
        </tr>
        {enhancedCategoriesData.map((val, key) => {
          return (
            <tr className={styles.tr} key={key}>
              <td className={styles.td}>{val.name}</td>
              <td className={styles.td}>{val.total}</td>
              <td className={styles.td} style={{ textTransform: "capitalize" }}>
                {val.type}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TopCategories;
