import "../../styles/Settings/SettingsContent.css";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import ImportTransactions from "./ImportTransactions";
import { ACCESS_TOKEN } from "../../constants";

const SettingsData = () => {
  const [transactionsData, setTransactionsData] = useState("");
  const [disableImport, setDisabledImport] = useState(true);
  const [parsedData, setParsedData] = useState([]);
  const [numberOfTransactions, setNumberOfTransactions] = useState(0);
  const [showImport, setShowImport] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const fetchData = () => {
    Promise.all([api.get("transactions/export/"), api.get("profile/")])
      .then(([exportRes, profileRes]) => {
        setTransactionsData(exportRes.data);
        setUsername(profileRes.data.username);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteProfile = async (d) => {
    d.preventDefault();

    try {
      let requestData;

      requestData = { username };
      requestData.password = deletePassword;

      const res = await api.post("/auth/login/", requestData);

      if (localStorage.getItem(ACCESS_TOKEN) === res.data.token) {
        api.delete("profile-delete/");
        alert("Profile Deleted Successfully :)");
        navigate("/logout");
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
    }
  };

  const parseCSV = (event) => {
    setDisabledImport(false);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setParsedData(results.data);
        setNumberOfTransactions(results.data.length);
      },
    });
  };

  const importData = () => {
    setShowImport(true);
  };

  const exportCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([transactionsData], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "quetzal_export.csv";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      {showImport && <ImportTransactions data={parsedData} />}

      <form className="settings-content-container">
        <div className="settings-sub-content-container">
          <div className="settings-content-header">Import Transactions</div>
          <input
            style={{}}
            type="file"
            accept=".csv"
            name="importFile"
            onChange={parseCSV}
          />
          <button
            className="data-settings-content-button"
            type="button"
            onClick={importData}
            disabled={disableImport}
          >
            {`Import ${numberOfTransactions != 0 ? numberOfTransactions : ""} Transactions`}
          </button>
        </div>
        <div className="settings-sub-content-container">
          <div className="settings-content-header">Export All Transactions</div>
          <div className="warning-text">
            File may contain sensitive data. Delete after use!
          </div>
          <button
            className="data-settings-content-button"
            type="button"
            onClick={exportCSV}
          >
            {"Export to CSV"}
          </button>
        </div>
        <div className="settings-sub-content-container">
          <div className="settings-content-header">Reset Profile</div>
          <div className="warning-text">
            Delete all accounts, transactions and categories. This action is
            irreversible!
          </div>
          <button className="data-settings-content-button-delete" type="button">
            {"Reset Profile"}
          </button>
        </div>
        <div className="settings-sub-content-container">
          <div className="settings-content-header">Delete Profile</div>
          <div className="warning-text">
            Delete this profile. This action is irreversible!
          </div>
          <input
            className="settings-content-input"
            type="password"
            style={{ marginTop: 8 }}
            value={deletePassword}
            onChange={(d) => setDeletePassword(d.target.value)}
            placeholder="Enter Password"
          />
          <button
            className="data-settings-content-button-delete"
            type="button"
            onClick={deleteProfile}
            disabled={deletePassword.length < 8}
          >
            {"Delete Profile"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SettingsData;
