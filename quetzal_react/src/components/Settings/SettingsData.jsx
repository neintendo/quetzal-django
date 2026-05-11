import "../../styles/Settings/SettingsContent.css";
import api from "../../api";
import { useEffect, useState } from "react";

const SettingsData = () => {
  const [transactionsData, setTransactionsData] = useState("");

  useEffect(() => {
    const getCSV = () => {
      api
        .get("transactions/export/")
        .then((res) => res.data)
        .then((data) => {
          setTransactionsData(data);
        })
        .catch((err) => alert(err));
    };

    getCSV();
  }, []);

  const exportCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([transactionsData], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "quetzal_export.csv";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <form className="settings-content-container">
      <div className="settings-sub-content-container">
        <div className="settings-content-header">Import Transactions</div>
        <button className="data-settings-content-button" type="button">
          {"Select CSV File"}
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
        <button className="data-settings-content-button-delete" type="button">
          {"Delete Profile"}
        </button>
      </div>
    </form>
  );
};

export default SettingsData;
