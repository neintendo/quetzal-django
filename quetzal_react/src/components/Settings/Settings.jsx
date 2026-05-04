import { useEffect } from "react";
import "../../styles/Settings/Settings.css";
useEffect;

const Settings = ({ onClose }) => {
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
            <div className="sidebar-sections">Profile</div>
            <div className="sidebar-sections">Appearance</div>
            <div className="sidebar-sections">Preferences</div>
            <div className="sidebar-sections">Data</div>
            <div className="sidebar-sections">{"Help & Support"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
