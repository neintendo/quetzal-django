import "../../styles/Settings/SettingsContent.css";
import api from "../../api";
import currencyList from "../Utilities/CurrencyList";
import { useEffect, useState } from "react";

const SettingsProfile = ({ route }) => {
  const [username, setUsername] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [main_currency, setMainCurrency] = useState("");
  const [userID, setUserID] = useState("");
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  // Used for disabling submit button
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalDisplayName, setOriginalDisplayName] = useState("");
  const [originalMainCurrency, setOriginalMainCurrency] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = () => {
      api
        .get("profile/")
        .then((res) => res.data)
        .then((data) => {
          setUsername(data.username);
          setDisplayName(data.display_name);
          setMainCurrency(data.main_currency);
          setUserID(data.id);

          // Used for comparison
          setOriginalUsername(data.username);
          setOriginalDisplayName(data.display_name);
          setOriginalMainCurrency(data.main_currency);
        })
        .catch((err) => alert(err));
    };

    getProfile();
  }, []);

  const hasChangesProfile =
    username !== originalUsername ||
    display_name !== originalDisplayName ||
    main_currency !== originalMainCurrency;

  const hasChangesPassword =
    old_password.length >= 8 &&
    new_password.length >= 8 &&
    new_password === confirm_password;

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData_profile;
      let requestData_password = {};

      requestData_profile = { username, display_name, main_currency };
      if (old_password || new_password) {
        requestData_password.old_password = old_password;
        requestData_password.new_password = new_password;
      }

      if (hasChangesProfile) {
        const res_pr = await api.put(route, requestData_profile);

        if (res_pr.status === 200) {
          alert("Profile updated successfully!");
        }
      }

      if (hasChangesPassword) {
        const res_ps = await api.put(
          `/change-password/${userID}/`,
          requestData_password,
        );

        if (res_ps.status === 200) {
          alert("Password updated successfully!");
        }
      }

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="settings-content-container" onSubmit={handleSubmit}>
      <div className="settings-sub-content-container">
        <div className="settings-content-header">Username</div>
        <input
          className="settings-content-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </div>
      <div className="settings-sub-content-container">
        <div className="settings-content-header">Display Name</div>
        <input
          className="settings-content-input"
          type="text"
          value={display_name}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          required
        />
      </div>
      <div className="settings-sub-content-container">
        <div className="settings-content-header">Main Currency</div>
        <select
          className="settings-content-input"
          type="text"
          value={main_currency}
          onChange={(e) => setMainCurrency(e.target.value)}
        >
          {currencyList.map(([sym, name]) => (
            <option key={name} value={sym}>
              {sym} - {name}
            </option>
          ))}
        </select>
      </div>
      <div className="settings-sub-content-container">
        <div className="settings-content-header">Password</div>
        <div className="settings-content-multiple-input-container">
          <input
            className="settings-content-input"
            type="password"
            value={old_password}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter Old Password"
          />
          <input
            className="settings-content-input"
            type="password"
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter New Password"
          />
          {new_password && (
            <input
              className="settings-content-input"
              type="password"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
            />
          )}
        </div>
      </div>
      <button
        className="settings-content-button"
        type="submit"
        disabled={(!hasChangesProfile && !hasChangesPassword) || loading}
      >
        {loading ? "LOADING..." : "Save Changes"}
      </button>
    </form>
  );
};
export default SettingsProfile;
