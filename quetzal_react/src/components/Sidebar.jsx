import "../styles/Sidebar.css";
import api from "../api";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Settings from "./Settings/Settings";

const Sidebar = ({ isOpen, onPageClick }) => {
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // const navigate = useNavigate();

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

  return (
    <>
      {showSettingsModal && (
        <Settings onClose={() => setShowSettingsModal(false)} />
      )}
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
          <div
            className="sidebar-menu"
            onClick={() => setShowSettingsModal(true)}
          >
            <div className="sidebar-profile">
              {profile ? (
                <div>
                  <span
                    style={{
                      color: "#888888",
                      textAlign: "center",
                    }}
                  >
                    ▋
                  </span>{" "}
                  {profile.display_name}
                </div>
              ) : (
                <div>LOADING...</div>
              )}
            </div>
            <div className="sidebar-settings-arrow">{"›"}</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
