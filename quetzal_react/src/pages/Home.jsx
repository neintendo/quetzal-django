import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";
import Accounts from "../components/Accounts/Accounts";
import Transactions from "../components/Transactions/Transactions";
import Recurring from "../components/Transactions/Recurring";
import Categories from "../components/Categories/Categories";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
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

  const pageHandler = (pageFromChild) => {
    setPage(pageFromChild);
  };

  const pageSwitch = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "accounts":
        return <Accounts />;
      case "transactions":
        return <Transactions />;
      case "recurring":
        return <Recurring />;
      case "categories":
        return <Categories />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={
        isSidebarOpen
          ? styles["home-container"]
          : styles["home-container-maximized"]
      }
    >
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        pageToHome={pageHandler}
      />
      {pageSwitch()}
    </div>
  );
}

export default Home;
