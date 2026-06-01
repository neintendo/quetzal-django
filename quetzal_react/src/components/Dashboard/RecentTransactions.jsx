import { useEffect, useState } from "react";
import api from "../../api";
import styles from "../../styles/Dashboard/RecentTransactionsTable.module.css";

const RecentTransactions = ({ onRowClick, refresh }) => {
  const [transactionsData, setTransactionsData] = useState([]);

  const fetchData = () => {
    Promise.all([api.get("transactions/recent/")])
      .then(([transactionsRes]) => {
        setTransactionsData(transactionsRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <>
      {transactionsData.length === 0 ? (
        <div className={styles["table-loading"]}>[ No Data ]</div>
      ) : (
        <table className={styles.table}>
          <tbody className={styles.tbody}>
            <tr className={styles.tr}>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Category</th>
            </tr>
            {transactionsData.map((val, key) => {
              return (
                <tr
                  className={styles.tr}
                  onClick={() =>
                    onRowClick(
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
                  <td className={styles.td}>{val.description}</td>
                  <td className={styles.td}>{val.amount}</td>
                  <td className={styles.td}>{val.category}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default RecentTransactions;
