import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [transaction_type, setTransaction_type] = useState("");

  // Call the getTransactions function
  useEffect(() => {
    getTransactions();
  }, []);

  // Function to get all the user transactions from database
  const getTransactions = () => {
    api
      .get("transactions/")
      .then((res) => res.data)
      .then((data) => {
        setTransactions(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const createTransaction = (e) => {
    e.preventDefault();
    api
      .post("transactions/", {
        amount,
        currency,
        description,
        datetime,
        account,
        category,
        transaction_type,
      })
      .then((res) => {
        if (res.status === 201) alert("Transaction created successfully");
        else alert("Error! Transaction not created");
      })
      .catch((err) => alert(err));
    getTransactions();
  };

  const deleteTransaction = (id) => {
    api
      .delete(`transactions/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Transaction deleted!");
        else alert("Failed to delete transaction.");
      })
      .catch((error) => alert(error));
    getTransactions();
  };

  return (
    <div>
      <Navbar />
      <div>.</div>
    </div>
  );
}

export default Home;
