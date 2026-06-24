import styles from "../../styles/Transactions/Recurring.module.css";

const Recurring = () => {
  return (
    <>
      <div className={styles.recurring}>
        <div className={styles["recurring-table-container"]}>
          <div className={styles["recurring-table-header"]}>
            <div className={styles["recurring-table-title-container"]}>
              <div className={styles["recurring-table-title"]}>
                Recurring Transactions
              </div>
            </div>
            <input
              className={styles["table-header-input"]}
              placeholder="Search Recurring Transactions"
            />
            <button className={styles["create-button"]}>
              {"+ Add Recurring Transaction"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recurring;
