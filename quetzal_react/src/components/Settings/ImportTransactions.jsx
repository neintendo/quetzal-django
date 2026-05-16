import { useEffect } from "react";
import api from "../../api";

function ImportTransactions({ data }) {
  const handleImport = async () => {
    let successCount = 0;
    let failCount = 0;
    let transferCount = 0;

    for (let i = 0; i < data.length; i++) {
      // Ignore mirror transfer transactions
      if (
        data[i]["Destination Account"] == "" &&
        data[i]["Transaction Type"] == "transfer"
      ) {
        i++;
        transferCount++;
      }
      const transaction = data[i];

      try {
        const requestData = {
          account_name: transaction.Account,
          amount: transaction.Amount,
          category_name: transaction.Category,
          currency: transaction.Currency,
          datetime: transaction.Datetime,
          description: transaction.Description,
          notes: transaction.Notes,
          transaction_type: transaction["Transaction Type"],
        };

        if (transaction["Transaction Type"] === "transfer") {
          requestData.destination_account_name =
            transaction["Destination Account"];
        }

        const res = await api.post("/transactions/", requestData);

        if (res.status === 201) {
          successCount++;
          console.log(`[${i + 1}/${data.length}] Imported:`, transaction);
        }
      } catch {
        failCount++;
        console.log(`[${i + 1}/${data.length}] Failed:`, transaction);
      }
    }

    alert(
      `Import Complete - Success: ${successCount}, Failed: ${failCount}, Transfers: ${transferCount}`,
    );
  };

  useEffect(() => {
    if (data && data.length > 0) {
      handleImport();
    }
  }, [data]);

  return null;
}
export default ImportTransactions;
