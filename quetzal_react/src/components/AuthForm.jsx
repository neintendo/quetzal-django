import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import currencyList from "./Utilities/CurrencyList";
import styles from "../styles/AuthForm.module.css";

function AuthForm({ route, method }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [main_currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "LOGIN" : "REGISTER";
  const link_path = method === "login" ? "/register" : "/login";
  const link_text =
    method === "login" ? "Don't have an account?" : "Already have an account?";

  useEffect(() => {
    const getUsers = () => {
      api
        .get("users/")
        .then((res) => res.data)
        .then((data) => {
          setUsers(data);
        })
        .catch((err) => alert(err));
    };

    getUsers();
  }, []);

  document.body.setAttribute("data-theme", "");
  const hasChangesLogin = password.length < 8 || username === "";
  const hasChangesRegister =
    password.length < 8 ||
    password !== passwordMatch ||
    username === "" ||
    display_name === "" ||
    main_currency === "" ||
    main_currency === "- Select Main Currency -";
  const doPasswordsMatch = password !== passwordMatch && method === "register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData;

      if (method === "login") {
        // For login, only username & password are required.
        requestData = { username, password };
      } else {
        requestData = {
          username,
          display_name,
          password,
          main_currency,
        };
      }
      const res = await api.post(route, requestData);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.token);
        navigate("/home");
      } else {
        navigate("/login");
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
    <form onSubmit={handleSubmit} className={styles["form-container"]}>
      <span className={styles["form-title"]}>{name}</span>
      {method === "login" ? (
        <select
          className={styles["form-input"]}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        >
          <optgroup label="User">
            <option>- Select User -</option>
            {users &&
              Array.isArray(users) &&
              [...users]
                .sort((a, b) => a.display_name.localeCompare(b.display_name))
                .map((users, index) => (
                  <option key={index} value={users.username}>
                    {users.display_name}
                  </option>
                ))}
          </optgroup>
        </select>
      ) : (
        <input
          className={styles["form-input"]}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      )}

      {method === "register" && (
        <input
          className={styles["form-input"]}
          type="text"
          value={display_name}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Name (eg. Jane Doe)"
          required
        />
      )}
      <input
        className={
          doPasswordsMatch ? styles["form-input-alert"] : styles["form-input"]
        }
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={method === "register" ? "Password (min. 8)" : "Password"}
        required
      />
      {method === "register" && (
        <input
          className={
            doPasswordsMatch ? styles["form-input-alert"] : styles["form-input"]
          }
          type="password"
          value={passwordMatch}
          onChange={(e) => setPasswordMatch(e.target.value)}
          placeholder="Confirm Password"
          required
        />
      )}
      {method === "register" && (
        <select
          className={styles["form-input"]}
          type="text"
          value={main_currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option>- Select Main Currency -</option>
          {currencyList.map(([sym, name]) => (
            <option key={name} value={sym}>
              {sym} - {name}
            </option>
          ))}
        </select>
      )}
      {/* Button disabled if form is incomplete & when loading to prevent double submission */}
      {method === "login" && (
        <button
          className={styles["form-button"]}
          type="submit"
          disabled={hasChangesLogin || loading}
        >
          {loading ? "LOADING..." : name}
        </button>
      )}
      {method === "register" && (
        <button
          className={styles["form-button"]}
          type="submit"
          disabled={hasChangesRegister || loading}
        >
          {loading ? "LOADING..." : name}
        </button>
      )}
      {/* Dynamic link that navigates between login & register pages */}
      <Link className={styles["where-to"]} to={link_path}>
        {link_text}
      </ Link>
    </form>
  );
}

export default AuthForm;
