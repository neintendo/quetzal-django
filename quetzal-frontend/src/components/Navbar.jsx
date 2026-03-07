import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-nav" type="button">
            {">"}
          </button>
        </div>
        <div className="navbar-center">quetzal</div>
        <div className="navbar-right">
          <button className="add-nav" type="button">
            {"+"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
