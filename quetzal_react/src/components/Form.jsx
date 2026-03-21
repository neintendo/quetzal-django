import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [main_currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "LOGIN" : "REGISTER";
  const link_path = method === "login" ? "/register" : "/login";
  const link_text =
    method === "login" ? "Don't have an account?" : "Already have an account?";

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
          email,
          display_name,
          password,
          main_currency: main_currency || "USD",
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
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{name}</h2>
      {method === "register" && (
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      )}
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      {method === "register" && (
        <input
          className="form-input"
          type="text"
          value={display_name}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Name (eg. Jane Doe)"
          required
        />
      )}
      {method === "register" && (
        <input
          className="form-input"
          type="text"
          value={main_currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Main Currency (default: USD)"
        />
      )}
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {/* Button disabled when loading to prevent double submission */}
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "LOADING..." : name}
      </button>
      {/* Dynamic link that navigates between login & register pages */}
      <a className="where-to" href={link_path}>
        {link_text}
      </a>
    </form>
  );
}

export default Form;
