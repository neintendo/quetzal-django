import "../../styles/Settings/SettingsContent.css";
import api from "../../api";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import ImportTransactions from "./ImportTransactions";

const SettingsData = () => {
  const [transactionsData, setTransactionsData] = useState("");
  const [disableImport, setDisabledImport] = useState(true);
  const [parsedData, setParsedData] = useState([]);
  const [numberOfTransactions, setNumberOfTransactions] = useState(0);
  const [showImport, setShowImport] = useState(false);

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
          <button className="data-settings-content-button-delete" type="button">
            {"Delete Profile"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SettingsData;
