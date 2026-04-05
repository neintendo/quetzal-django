import "../styles/Navbar.css";
import Sidebar from "./Sidebar";
import { useState } from "react";
import AddTransaction from "./Transactions/AddTransaction";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleTransactionAdded = () => {
    setShowAddModal(false);
    // add code for refreshing table here later
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
      <Sidebar isOpen={isSidebarOpen} />

      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="sidebar-nav"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            type="button"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "<" : ">"}
          </button>
        </div>
        <div className="navbar-center">quetzal</div>
        <div className="navbar-right">
          <button
            className="add-nav"
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
