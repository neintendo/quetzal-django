import styles from "../../styles/Settings/Settings.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsProfile from "./SettingsProfile";
import SettingsData from "./SettingsData";
import SettingsPreferences from "./SettingsPreferences";

const Settings = ({ onClose }) => {
  const [page, setPage] = useState("profile");
  const navigate = useNavigate();

  const pageSwitch = () => {
    switch (page) {
      case "profile":
        return <SettingsProfile route={"/profile-update/"} />;
      // case "appearance":
      //   return <Accounts />;
      case "preferences":
        return <SettingsPreferences />;
      case "data":
        return <SettingsData />;
      default:
        return <SettingsProfile route={"/profile-update/"} />;
    }
  };

  useEffect(() => {
    function clickOutside(event) {
      const modal = document.getElementById("divListen");
      if (modal && !modal.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles["settings-modal"]}>
      <div id="divListen" className={styles["settings-container"]}>
        <div className={styles["settings-sidebar"]}>
          <div className={styles["settings-sidebar-title"]}>Settings</div>
          <div className={styles["sidebar-sections-container"]}>
            <div
              onClick={() => setPage("profile")}
              className={
                page === "profile"
                  ? styles["sidebar-sections-active"]
                  : styles["sidebar-sections"]
              }
            >
              Account
            </div>
            <div
              onClick={() => setPage("preferences")}
              className={
                page === "preferences"
                  ? styles["sidebar-sections-active"]
                  : styles["sidebar-sections"]
              }
            >
              Preferences
            </div>
            <div
              onClick={() => setPage("data")}
              className={
                page === "data"
                  ? styles["sidebar-sections-active"]
                  : styles["sidebar-sections"]
              }
            >
              Data
            </div>
            <a
              href="https://github.com/neintendo/quetzal"
              target="_blank"
              style={{ textDecoration: "none" }}
              className={
                page === "help"
                  ? styles["sidebar-sections-active"]
                  : styles["sidebar-sections"]
              }
            >
              {"Help & Support ›"}
            </a>
          </div>
          <div
            className={styles["sidebar-logout"]}
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to logout?",
              );
              if (confirmed) {
                navigate("/logout");
              }
            }}
            title="Logout"
          >
            {"↲"}
          </div>
        </div>
        <div className={styles["settings-content"]}>{pageSwitch()}</div>
        <div className={styles["modal-close-button"]} onClick={() => onClose()}>
          {"X"}
        </div>
      </div>
    </div>
  );
};

export default Settings;
