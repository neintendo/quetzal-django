import "../styles/Sidebar.css";
import api from "../api";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = ({ isOpen }) => {
  const [profile, setProfile] = useState(null);

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
      <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-top">
          <div className="sidebar-pages-top">{"Dashboard"}</div>
          <div className="sidebar-pages-top">{"Transactions"}</div>
          <div className="sidebar-pages-top">{"Accounts"}</div>
          <div className="sidebar-pages-top">{"Categories"}</div>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-profile">
            <>
              {profile ? (
                <div>░ {profile.username}</div>
              ) : (
                <div>LOADING...</div>
              )}
            </>
          </div>
          <div className="sidebar-settings">↑</div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
