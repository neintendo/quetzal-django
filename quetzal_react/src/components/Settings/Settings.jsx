import "../../styles/Settings/Settings.css";
import { useEffect, useState } from "react";
import SettingsProfile from "./SettingsProfile";
import { useNavigate } from "react-router-dom";

const Settings = ({ onClose }) => {
  const [page, setPage] = useState("profile");
  const navigate = useNavigate();

  const pageSwitch = () => {
    switch (page) {
      case "profile":
        return <SettingsProfile route={"/profile-update/"} />;
      // case "appearance":
      //   return <Accounts />;
      // case "preferences":
      //   return <Transactions />;
      // case "data":
      //   return <Categories />;
      // case "help":
      //   return <Categories />;
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
    <div className="settings-modal">
      <div id="divListen" className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-sidebar-title">Settings</div>
          <div className="sidebar-sections-container">
            <div
              onClick={() => setPage("profile")}
              className={
                page === "profile"
                  ? "sidebar-sections-active"
                  : "sidebar-sections"
              }
            >
              Account
            </div>
            <div
              onClick={() => setPage("appearance")}
              className={
                page === "appearance"
                  ? "sidebar-sections-active"
                  : "sidebar-sections"
              }
            >
              Appearance
            </div>
            <div
              onClick={() => setPage("preferences")}
              className={
                page === "preferences"
                  ? "sidebar-sections-active"
                  : "sidebar-sections"
              }
            >
              Preferences
            </div>
            <div
              onClick={() => setPage("data")}
              className={
                page === "data" ? "sidebar-sections-active" : "sidebar-sections"
              }
            >
              Data
            </div>
            <div
              className={
                page === "help" ? "sidebar-sections-active" : "sidebar-sections"
              }
            >
              {"Help & Support ›"}
            </div>
          </div>
          <div
            className="sidebar-logout"
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
        <div className="settings-content">{pageSwitch()}</div>
        <div className="modal-close-button" onClick={() => onClose()}>
          {"X"}
        </div>
      </div>
    </div>
  );
};

export default Settings;
