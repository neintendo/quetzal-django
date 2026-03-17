import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Accounts from "../components/Accounts/Accounts";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <Sidebar />
      <Accounts />
    </div>
  );
}

export default Home;
