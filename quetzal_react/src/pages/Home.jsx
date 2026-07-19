import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";
import Accounts from "../components/Accounts/Accounts";
import Transactions from "../components/Transactions/Transactions";
import Recurring from "../components/Transactions/Recurring";
import Categories from "../components/Categories/Categories";
import RecurringAuto from "../components/Transactions/RecurringAuto";
import SetTheme from "../components/Settings/SetTheme";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const widthTrigger = window.screen.width / 1.65;

  RecurringAuto();
  SetTheme();

  // Auto open/close sidebar when resizing
  useEffect(() => {
    let previousOuterWidth = window.outerWidth;

    const handleResize = () => {

      // Ignore zoom
      if (window.outerWidth === previousOuterWidth) {
        return;
      }

      if (window.innerWidth < widthTrigger) {
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
      <div
        className={styles["sidebar-hover-trigger"]}
        onMouseEnter={toggleSidebar}
      ></div>
    </div>
  );
}

export default Home;
