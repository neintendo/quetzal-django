import api from "../../api";
import { useState, useEffect } from "react";
import styles from "../../styles/Settings/SettingsContent.module.css";

const SettingsPreferences = () => {
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(profile?.theme);

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

  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme);
    }
  }, [profile]);

  const ChangeTheme = async (newTheme) => {
    try {
      await api.put("/profile-update/", { theme: newTheme });
      window.location.reload(true);
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        // Shows status errors from the backend to the user.
        alert(JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error("No response received", error.request);
        alert(
          "No response from server. Please check if the backend is running :)",
        );
      } else {
        console.error("Error:", error.message);
        alert(error.message);
      }
    }
  };

  return (
    <form className={styles["settings-content-container"]}>
      <div className={styles["settings-sub-content-container"]}>
        <div className={styles["settings-content-header"]}>Theme</div>

        <select
          className={styles["settings-content-input"]}
          type="text"
          value={theme}
          onChange={(e) => {
            const newTheme = e.target.value;
            setTheme(newTheme);
            ChangeTheme(newTheme);
          }}
        >
          <option value="system">Auto (follow system settings)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </form>
  );
};
export default SettingsPreferences;
