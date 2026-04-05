import { useState } from "react";
import "../../styles/Accounts/AddAccount.css";
import "../../styles/Accounts/AddAccountForm.css";
import api from "../../api";

function AddAccount({ route, onSuccess, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);

  const currencyList = [
    ["AED", "UAE Dirham"],
    ["AFN", "Afghan Afghani"],
    ["ALL", "Albanian Lek"],
    ["AMD", "Armenian Dram"],
    ["ANG", "Netherlands Antillean Guilder"],
    ["AOA", "Angolan Kwanza"],
    ["ARS", "Argentine Peso"],
    ["AUD", "Australian Dollar"],
    ["AWG", "Aruban Florin"],
    ["AZN", "Azerbaijani Manat"],
    ["BAM", "Bosnia-Herzegovina Convertible Mark"],
    ["BBD", "Barbadian Dollar"],
    ["BDT", "Bangladeshi Taka"],
    ["BHD", "Bahraini Dinar"],
    ["BIF", "Burundian Franc"],
    ["BMD", "Bermudian Dollar"],
    ["BND", "Brunei Dollar"],
    ["BOB", "Bolivian Boliviano"],
    ["BRL", "Brazilian Real"],
    ["BSD", "Bahamian Dollar"],
    ["BTN", "Bhutanese Ngultrum"],
    ["BWP", "Botswana Pula"],
    ["BYN", "Belarusian Ruble"],
    ["BZD", "Belize Dollar"],
    ["CAD", "Canadian Dollar"],
    ["CDF", "Congolese Franc"],
    ["CHF", "Swiss Franc"],
    ["CLP", "Chilean Peso"],
    ["CNH", "Chinese Renminbi Yuan (Offshore)"],
    ["CNY", "Chinese Renminbi Yuan"],
    ["COP", "Colombian Peso"],
    ["CRC", "Costa Rican Colón"],
    ["CUP", "Cuban Peso"],
    ["CVE", "Cape Verdean Escudo"],
    ["CZK", "Czech Koruna"],
    ["DJF", "Djiboutian Franc"],
    ["DKK", "Danish Krone"],
    ["DOP", "Dominican Peso"],
    ["DZD", "Algerian Dinar"],
    ["EGP", "Egyptian Pound"],
    ["ERN", "Eritrean Nakfa"],
    ["ETB", "Ethiopian Birr"],
    ["EUR", "Euro"],
    ["FJD", "Fijian Dollar"],
    ["FKP", "Falkland Islands Pound"],
    ["GBP", "British Pound"],
    ["GEL", "Georgian Lari"],
    ["GGP", "Guernsey Pound"],
    ["GHS", "Ghanaian Cedi"],
    ["GIP", "Gibraltar Pound"],
    ["GMD", "Gambian Dalasi"],
    ["GNF", "Guinean Franc"],
    ["GTQ", "Guatemalan Quetzal"],
    ["GYD", "Guyanese Dollar"],
    ["HKD", "Hong Kong Dollar"],
    ["HNL", "Honduran Lempira"],
    ["HTG", "Haitian Gourde"],
    ["HUF", "Hungarian Forint"],
    ["IDR", "Indonesian Rupiah"],
    ["ILS", "Israeli New Shekel"],
    ["IMP", "Isle of Man Pound"],
    ["INR", "Indian Rupee"],
    ["IQD", "Iraqi Dinar"],
    ["IRR", "Iranian Rial"],
    ["ISK", "Icelandic Króna"],
    ["JEP", "Jersey Pound"],
    ["JMD", "Jamaican Dollar"],
    ["JOD", "Jordanian Dinar"],
    ["JPY", "Japanese Yen"],
    ["KES", "Kenyan Shilling"],
    ["KGS", "Kyrgyzstani Som"],
    ["KHR", "Cambodian Riel"],
    ["KMF", "Comorian Franc"],
    ["KRW", "South Korean Won"],
    ["KWD", "Kuwaiti Dinar"],
    ["KYD", "Cayman Islands Dollar"],
    ["KZT", "Kazakhstani Tenge"],
    ["LAK", "Lao Kip"],
    ["LBP", "Lebanese Pound"],
    ["LKR", "Sri Lankan Rupee"],
    ["LRD", "Liberian Dollar"],
    ["LSL", "Lesotho Loti"],
    ["LYD", "Libyan Dinar"],
    ["MAD", "Moroccan Dirham"],
    ["MDL", "Moldovan Leu"],
    ["MGA", "Malagasy Ariary"],
    ["MKD", "Macedonian Denar"],
    ["MMK", "Myanmar Kyat"],
    ["MNT", "Mongolian Tögrög"],
    ["MOP", "Macanese Pataca"],
    ["MRO", "Mauritanian Ouguiya (pre-2018)"],
    ["MRU", "Mauritanian Ouguiya"],
    ["MUR", "Mauritian Rupee"],
    ["MVR", "Maldivian Rufiyaa"],
    ["MWK", "Malawian Kwacha"],
    ["MXN", "Mexican Peso"],
    ["MYR", "Malaysian Ringgit"],
    ["MZN", "Mozambican Metical"],
    ["NAD", "Namibian Dollar"],
    ["NGN", "Nigerian Naira"],
    ["NIO", "Nicaraguan Córdoba"],
    ["NOK", "Norwegian Krone"],
    ["NPR", "Nepalese Rupee"],
    ["NZD", "New Zealand Dollar"],
    ["OMR", "Omani Rial"],
    ["PAB", "Panamanian Balboa"],
    ["PEN", "Peruvian Sol"],
    ["PGK", "Papua New Guinean Kina"],
    ["PHP", "Philippine Peso"],
    ["PKR", "Pakistani Rupee"],
    ["PLN", "Polish Złoty"],
    ["PYG", "Paraguayan Guaraní"],
    ["QAR", "Qatari Riyal"],
    ["RON", "Romanian Leu"],
    ["RSD", "Serbian Dinar"],
    ["RUB", "Russian Ruble"],
    ["RWF", "Rwandan Franc"],
    ["SAR", "Saudi Riyal"],
    ["SBD", "Solomon Islands Dollar"],
    ["SCR", "Seychellois Rupee"],
    ["SDG", "Sudanese Pound"],
    ["SEK", "Swedish Krona"],
    ["SGD", "Singapore Dollar"],
    ["SHP", "Saint Helena Pound"],
    ["SLE", "Sierra Leonean Leone"],
    ["SOS", "Somali Shilling"],
    ["SRD", "Surinamese Dollar"],
    ["SSP", "South Sudanese Pound"],
    ["STN", "São Tomé and Príncipe Dobra"],
    ["SVC", "Salvadoran Colón"],
    ["SYP", "Syrian Pound"],
    ["SZL", "Swazi Lilangeni"],
    ["THB", "Thai Baht"],
    ["TJS", "Tajikistani Somoni"],
    ["TMT", "Turkmenistani Manat"],
    ["TND", "Tunisian Dinar"],
    ["TOP", "Tongan Paʻanga"],
    ["TRY", "Turkish Lira"],
    ["TTD", "Trinidad and Tobago Dollar"],
    ["TWD", "New Taiwan Dollar"],
    ["TZS", "Tanzanian Shilling"],
    ["UAH", "Ukrainian Hryvnia"],
    ["UGX", "Ugandan Shilling"],
    ["USD", "United States Dollar"],
    ["UYU", "Uruguayan Peso"],
    ["UZS", "Uzbekistani Som"],
    ["VES", "Venezuelan Bolívar"],
    ["VND", "Vietnamese Đồng"],
    ["VUV", "Vanuatu Vatu"],
    ["WST", "Samoan Tālā"],
    ["XAF", "Central African CFA Franc"],
    ["XAG", "Silver"],
    ["XAU", "Gold"],
    ["XCD", "East Caribbean Dollar"],
    ["XCG", "Caribbean Guilder"],
    ["XOF", "West African CFA Franc"],
    ["XPD", "Palladium"],
    ["XPF", "CFP Franc"],
    ["XPT", "Platinum"],
    ["YER", "Yemeni Rial"],
    ["ZAR", "South African Rand"],
    ["ZMW", "Zambian Kwacha"],
    ["ZWG", "Zimbabwean Gold"],
  ];

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let requestData;

      requestData = { name, type, currency };

      const res = await api.post(route, requestData);

      if (res.status === 201) {
        alert("Account created successfully!");

        setName("");
        setType("");
        setCurrency("");

        if (onSuccess) onSuccess();
        if (onClose) onClose();
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
    <div className="add-account-modal">
      <form onSubmit={handleSubmit} className="add-account-form-container">
        <div className="modal-title-container">
          <div className="modal-title">Add Account</div>
          <div
            className="modal-close-button"
            onClick={onClose}
            title="Close Modal"
          >
            X
          </div>
        </div>
        <input
          className="add-account-form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="add-account-form-input"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type"
          required
        />
        <select
          className="add-account-form-input"
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option>- Select Currency -</option>
          {currencyList.map(([sym, name]) => (
            <option key={name} value={sym}>
              {sym} - {name}
            </option>
          ))}
        </select>
        <button
          className="add-account-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "LOADING..." : "Add Account"}
        </button>
      </form>
    </div>
  );
}

export default AddAccount;
