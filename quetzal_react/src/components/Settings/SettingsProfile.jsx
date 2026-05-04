import "../../styles/Settings/SettingsContent.css";
import api from "../../api";
import currencyList from "../Utilities/CurrencyList";
import { useEffect, useState } from "react";

const SettingsProfile = ({ route }) => {
  const [username, setUsername] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [main_currency, setMainCurrency] = useState("");
  // const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = () => {
      api
        .get("profile/")
        .then((res) => res.data)
        .then((data) => {
          // setProfile(data);
          setUsername(data.username);
          setDisplayName(data.display_name);
          setMainCurrency(data.main_currency);
        })
        .catch((err) => alert(err));
    };

    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData;

      requestData = { username, display_name, main_currency };

      const res = await api.put(route, requestData);

      if (res.status === 200) {
        alert("Profile updated successfully!");
        window.location.reload(true);
      }
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
      <button
        className="settings-content-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "LOADING..." : "Save Changes"}
      </button>
    </form>
  );
};
export default SettingsProfile;
