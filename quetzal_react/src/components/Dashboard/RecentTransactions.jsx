import { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/Dashboard/RecentTransactions.css";

const RecentTransactions = () => {
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
  }, []);

  return (
    <table>
      <tbody>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Category</th>
        </tr>
        {transactionsData.map((val, key) => {
          return (
            <tr
              // onClick={() =>
              //   onRowClick(
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
              <td>{val.description}</td>
              <td>{val.amount}</td>
              <td>{val.category}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecentTransactions;
