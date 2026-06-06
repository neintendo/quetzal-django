import styles from "../styles/Sidebar.module.css";
import api from "../api";
import { useEffect, useState } from "react";
import Settings from "./Settings/Settings";

const Sidebar = ({ isOpen, onPageClick }) => {
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const getProfile = () => {
    api
      .get("profile/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
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
      <nav
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      >
        <div className={styles["sidebar-top"]}>
          <div
            className={
              currentPage === "dashboard"
                ? styles["sidebar-pages-top-active"]
                : styles["sidebar-pages-top"]
            }
            onClick={() => {
              (onPageClick("dashboard"), setCurrentPage("dashboard"));
            }}
          >
            {"Dashboard"}
          </div>

          <div
            className={
              currentPage === "accounts"
                ? styles["sidebar-pages-top-active"]
                : styles["sidebar-pages-top"]
            }
            onClick={() => {
              (onPageClick("accounts"), setCurrentPage("accounts"));
            }}
          >
            {"Accounts"}
          </div>
          <div
            className={
              currentPage === "transactions"
                ? styles["sidebar-pages-top-active"]
                : styles["sidebar-pages-top"]
            }
            onClick={() => {
              (onPageClick("transactions"), setCurrentPage("transactions"));
            }}
          >
            {"Transactions"}
          </div>
          <div
            className={
              currentPage === "recurring"
                ? styles["sidebar-pages-top-active"]
                : styles["sidebar-pages-top"]
            }
            onClick={() => {
              (onPageClick("recurring"), setCurrentPage("recurring"));
            }}
          >
            {"Recurring"}
          </div>
          <div
            className={
              currentPage === "categories"
                ? styles["sidebar-pages-top-active"]
                : styles["sidebar-pages-top"]
            }
            onClick={() => {
              (onPageClick("categories"), setCurrentPage("categories"));
            }}
          >
            {"Categories"}
          </div>
        </div>
        <div className={styles["sidebar-bottom"]}>
          <div
            className={styles["sidebar-menu"]}
            onClick={() => setShowSettingsModal(true)}
          >
            <div className={styles["sidebar-profile"]}>
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
            <div className={styles["sidebar-settings-arrow"]}>{"›"}</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
