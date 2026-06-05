import styles from "../../styles/Dashboard/DashboardStatus.module.css";
import api from "../../api";
import { useState, useEffect } from "react";
import CurrentMonth from "../Utilities/CurrentMonth";

const DashboardStatus = () => {
  const { currentMonth } = CurrentMonth();
  const [accountAggregates, setAccountAggregates] = useState([]);
  const [profile, setProfile] = useState([]);
  const [incomeExpenseTotals, setIncomeExpenseTotals] = useState([]);
  const [incomeAggregate, setIncomeAggregate] = useState([]);
  const [expenseAggregate, setExpenseAggregate] = useState([]);

  const fetchData = () => {
    Promise.all([
      api.get("accounts/aggregate/"),
      api.get("profile/"),
      // Income / Expense totals for month-to-date & ratio
      api.get("transactions/aggregate/", {
        params: { start_date: currentMonth },
      }),
      // for Income Average MTD
      api.get("transactions/aggregate/", {
        params: { start_date: currentMonth, transaction_type: "income" },
      }),
      // for Expense Average MTD
      api.get("transactions/aggregate/", {
        params: { start_date: currentMonth, transaction_type: "expense" },
      }),
    ])
      .then(
        ([
          aggregatesRes,
          profileRes,
          ieTotalsRes,
          incomeAggregateRes,
          expenseAggregateRes,
        ]) => {
          setAccountAggregates(aggregatesRes.data);
          setProfile(profileRes.data);
          setIncomeExpenseTotals(ieTotalsRes.data);
          setIncomeAggregate(incomeAggregateRes.data);
          setExpenseAggregate(expenseAggregateRes.data);
        },
      )
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const refresh = () => {
  //   fetchData();
  // };

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: profile?.main_currency || "USD", // USD is just a fallback
  });

  return (
    <>
      <div className={styles["dashboard-status-container"]}>
        <div className={styles["dashboard-status-group"]}>
          <div className={styles["dashboard-status"]}>
            Net Worth ›{" "}
            {accountAggregates?.accounts_converted != 0
              ? `± ${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`
              : `${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Income [MTD] ›{" "}
            {incomeExpenseTotals?.transactions_converted != 0
              ? `± ${currencyFormatter.format(incomeExpenseTotals?.income) ?? "..."}`
              : `${currencyFormatter.format(incomeExpenseTotals?.income) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Expenses [MTD] ›{" "}
            {incomeExpenseTotals?.transactions_converted != 0
              ? `± ${currencyFormatter.format(incomeExpenseTotals?.expense) ?? "..."}`
              : `${currencyFormatter.format(incomeExpenseTotals?.expense) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Income / Expense Ratio ›{" "}
            {incomeExpenseTotals?.transactions_converted != 0
              ? `± ${(incomeExpenseTotals?.income / incomeExpenseTotals?.expense).toFixed(2)}`
              : (
                  incomeExpenseTotals?.income / incomeExpenseTotals?.expense
                ).toFixed(2)}
          </div>
          <div className={styles["dashboard-status"]}>
            Average Income ›{" "}
            {incomeAggregate?.transactions_converted != 0
              ? `± ${currencyFormatter.format(incomeAggregate?.income / incomeAggregate.transaction_count) ?? "..."}`
              : `${currencyFormatter.format(incomeAggregate?.income / incomeAggregate.transaction_count) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Average Expense ›{" "}
            {expenseAggregate?.transactions_converted != 0
              ? `± ${currencyFormatter.format(expenseAggregate?.expense / expenseAggregate.transaction_count) ?? "..."}`
              : `${currencyFormatter.format(expenseAggregate?.expense / expenseAggregate.transaction_count) ?? "..."}`}
          </div>
        </div>
        {/* Connect carousel end-to-end */}
        <div aria-hidden className={styles["dashboard-status-group"]}>
          <div className={styles["dashboard-status"]}>
            Net Worth ›{" "}
            {accountAggregates?.accounts_converted != 0
              ? `± ${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`
              : `${currencyFormatter.format(accountAggregates?.total_balance) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Income [MTD] ›{" "}
            {incomeExpenseTotals?.transactions_converted != 0
              ? `± ${currencyFormatter.format(incomeExpenseTotals?.income) ?? "..."}`
              : `${currencyFormatter.format(incomeExpenseTotals?.income) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Expenses [MTD] ›{" "}
            {incomeExpenseTotals?.transactions_converted != 0
              ? `± ${currencyFormatter.format(incomeExpenseTotals?.expense) ?? "..."}`
              : `${currencyFormatter.format(incomeExpenseTotals?.expense) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Income / Expense Ratio ›{" "}
            {incomeExpenseTotals?.transactions_converted != 0
              ? `± ${(incomeExpenseTotals?.income / incomeExpenseTotals?.expense).toFixed(2)}`
              : (
                  incomeExpenseTotals?.income / incomeExpenseTotals?.expense
                ).toFixed(2)}
          </div>
          <div className={styles["dashboard-status"]}>
            Average Income ›{" "}
            {incomeAggregate?.transactions_converted != 0
              ? `± ${currencyFormatter.format(incomeAggregate?.income / incomeAggregate.transaction_count) ?? "..."}`
              : `${currencyFormatter.format(incomeAggregate?.income / incomeAggregate.transaction_count) ?? "..."}`}
          </div>
          <div className={styles["dashboard-status"]}>
            Average Expense ›{" "}
            {expenseAggregate?.transactions_converted != 0
              ? `± ${currencyFormatter.format(expenseAggregate?.expense / expenseAggregate.transaction_count) ?? "..."}`
              : `${currencyFormatter.format(expenseAggregate?.expense / expenseAggregate.transaction_count) ?? "..."}`}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardStatus;
