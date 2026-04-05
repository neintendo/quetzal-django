import "../styles/Sidebar.css";
import api from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onPageClick }) => {
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(true);
  const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();

  const getProfile = () => {
    api
      .get("profile/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getProfile();
  }, []);

  const toggleView = () => {
    setShowProfile(!showProfile); // Switches true to false, false to true
  };

  console.log("dsd", onPageClick);

  return (
    <>
      <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-top">
          <div
            className={
              currentPage === "dashboard"
                ? "sidebar-pages-top-active"
                : "sidebar-pages-top"
            }
            onClick={() => {
              (onPageClick("dashboard"), setCurrentPage("dashboard"));
            }}
          >
            {"Dashboard"}
          </div>
          <div
            className={
              currentPage === "transactions"
                ? "sidebar-pages-top-active"
                : "sidebar-pages-top"
            }
            onClick={() => {
              (onPageClick("transactions"), setCurrentPage("transactions"));
            }}
          >
            {"Transactions"}
          </div>
          <div
            className={
              currentPage === "accounts"
                ? "sidebar-pages-top-active"
                : "sidebar-pages-top"
            }
            onClick={() => {
              (onPageClick("accounts"), setCurrentPage("accounts"));
            }}
          >
            {"Accounts"}
          </div>
          <div
            className={
              currentPage === "categories"
                ? "sidebar-pages-top-active"
                : "sidebar-pages-top"
            }
            onClick={() => {
              (onPageClick("categories"), setCurrentPage("categories"));
            }}
          >
            {"Categories"}
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-menu">
            {showProfile ? (
              // Show profile
              <div className="sidebar-profile">
                {profile ? (
                  <div>▒ {profile.display_name}</div>
                ) : (
                  <div>LOADING...</div>
                )}
              </div>
            ) : (
              // Show options
              <div className="sidebar-options">
                <div className="sidebar-options-icons" title="Help">
                  {"?"}
                </div>
                <div className="sidebar-options-icons" title="Settings">
                  {"⌥"}
                </div>
                <div
                  className="sidebar-options-icons"
                  title="Logout"
                  onClick={() => navigate("/logout")}
                >
                  {"↳"}
                </div>
              </div>
            )}

            <div
              className="sidebar-options-toggle"
              title="Options"
              onClick={toggleView}
            >
              {showProfile ? "▫" : "▪"}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
