import "../styles/Sidebar.css";
import api from "../api";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(true);
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

  return (
    <>
      <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-top">
          <div className="sidebar-pages-top">{"Dashboard"}</div>
          <div className="sidebar-pages-top">{"Transactions"}</div>
          <div className="sidebar-pages-top">{"Accounts"}</div>
          <div className="sidebar-pages-top">{"Categories"}</div>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-menu">
            {showProfile ? (
              // Show profile
              <div className="sidebar-profile">
                {profile ? (
                  <div>▒ {profile.username}</div>
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
