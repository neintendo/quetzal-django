import { useEffect, useState } from "react";
import api from "../../api";

const RecurringAuto = () => {
  const [recurringData, setRecurringData] = useState([]);

  // Fetch recurring transactions from backend
  const fetchData = () => {
    Promise.all([api.get("recurring/")])
      .then(([recurringRes]) => {
        setRecurringData(recurringRes.data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processRecurringTransactions = async () => {
    // 1: Loop through transactions
    for (let countOuter = 0; countOuter < recurringData.length; countOuter++) {
      let toRemove = [];
      // Loop through datetimes for each individual transactions
      for (
        let countInner = 0;
        countInner < recurringData[countOuter].datetimes.length;
        countInner++
      ) {
        // Add transaction if the current date is later than date in array
        if (
          new Date().getTime() >
          new Date(recurringData[countOuter].datetimes[countInner]).getTime()
        ) {
          toRemove.push(recurringData[countOuter].datetimes[countInner]);
        }
      }
      // 2: Update datetimes for the recurring transaction
      if (toRemove.length > 0) {
        const filteredDatetimes = recurringData[countOuter].datetimes.filter(
          (date) => !toRemove.includes(date),
        );
        try {
          await api.put(`/recurring/${recurringData[countOuter].id}/`, {
            datetimes: filteredDatetimes,
            account: recurringData[countOuter].account,
          });
        } catch (error) {
          console.error("Update error:", error.response.data || error.message);
          continue; // Skip creating transactions if update fails
        }
      }
      // 3: Create transactions
      for (let i = 0; i < toRemove.length; i++) {
        try {
          let requestData;

          requestData = {
            amount: recurringData[countOuter].amount,
            description: recurringData[countOuter].description,
            datetime: toRemove[i],
            account_name: recurringData[countOuter].account,
            category_name: recurringData[countOuter].category,
            transaction_type: recurringData[countOuter].transaction_type,
            currency: recurringData[countOuter].currency,
          };

          if (recurringData[countOuter].transaction_type === "transfer") {
            requestData.destination_account_name =
              recurringData[countOuter].destination_account;
          }

          if (recurringData[countOuter].notes !== "") {
            requestData.notes = recurringData[countOuter].notes;
          }

          await api.post("/transactions/", requestData);
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
      }
    }
  };

  useEffect(() => {
    if (recurringData.length > 0) {
      processRecurringTransactions();
    }
  }, [recurringData]);
};

export default RecurringAuto;
