import styles from "../styles/Navbar.module.css";
import Sidebar from "./Sidebar";
import { useState } from "react";
import AddTransaction from "./Transactions/AddTransaction";

const Navbar = ({ isSidebarOpen, toggleSidebar, pageToHome }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleTransactionAdded = () => {
    setShowAddModal(false);
    // add code for refreshing table here later
  };

  const handlePageClick = (pageFromChild) => {
    pageToHome(pageFromChild);
  };

  return (
    <>
      {showAddModal && (
        <AddTransaction
          route="/transactions/"
          onClose={() => setShowAddModal(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onPageClick={handlePageClick} />

      <nav className={styles["navbar"]}>
        <div className={styles["navbar-left"]}>
          <button
            className={styles["sidebar-nav"]}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            type="button"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "<" : ">"}
          </button>
        </div>
        <div className={styles["navbar-center"]}>quetzal</div>
        <div className={styles["navbar-right"]}>
          <button
            className={styles["add-nav"]}
            title="Add Transaction"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            {"+"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
