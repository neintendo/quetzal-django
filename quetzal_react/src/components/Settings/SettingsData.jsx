import "../../styles/Settings/SettingsContent.css";

const SettingsData = () => {
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
        <button className="data-settings-content-button" type="button">
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
