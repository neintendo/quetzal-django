import "../styles/Home.css";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Accounts from "../components/Accounts/Accounts";
import Transactions from "../components/Transactions/Transactions";
import Categories from "../components/Categories/Categories";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [page, setPage] = useState(""); // Set default to dashboard later

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
      case "accounts":
        return <Accounts />;
      case "transactions":
        return <Transactions />;
      case "categories":
        return <Categories />;
      default:
        return <Categories />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={isSidebarOpen ? "home-container" : "home-container-maximized"}
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
