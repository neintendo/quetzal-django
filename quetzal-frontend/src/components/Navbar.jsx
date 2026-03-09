import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1080) {
        // Mobile breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
