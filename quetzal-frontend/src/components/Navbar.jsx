import "../styles/Navbar.css";
import Sidebar from "./Sidebar";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
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
          <button className="add-nav" type="button">
            {"+"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
