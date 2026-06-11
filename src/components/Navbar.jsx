import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faRightFromBracket,
  faShieldHalved,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  isLoggedIn,
  logout,
  logoutUser,
  isAdmin,
  getUser,
} from "../services/authService";
import "../styles/Navbar.css";

const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loggedIn = isLoggedIn();
  const user = loggedIn ? getUser() : null;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    logout();
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
        <span className="logo" onClick={() => (window.location.href = "/")}>
          VALLEJOBS
        </span>
      </div>

      <div className="navbar-center">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar empleos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>

      <div className="navbar-right">
        {loggedIn ? (
          <div className="profile-menu-wrapper" ref={menuRef}>
            <button
              className="profile-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="profile-avatar">
                {user?.foto ? (
                  <img src={user.foto} alt="avatar" className="avatar-img" />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </div>
              <span className="profile-arrow">{menuOpen ? "▲" : "▼"}</span>
            </button>

            {menuOpen && (
              <div className="profile-dropdown">
                <button onClick={() => (window.location.href = "/UserProfile")}>
                  <FontAwesomeIcon icon={faUser} /> Mi perfil
                </button>
                <button onClick={() => (window.location.href = "/dashboard")}>
                  <FontAwesomeIcon icon={faUser} /> Dashboard
                </button>
                {isAdmin() && (
                  <>
                    <div className="dropdown-divider" />
                    <button
                      onClick={() =>
                        (window.location.href = "/AdminCategories")
                      }
                    >
                      <FontAwesomeIcon icon={faShieldHalved} /> Categorías
                    </button>
                  </>
                )}
                <div className="dropdown-divider" />
                <button className="logout-btn" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="register-btn"
              onClick={() => (window.location.href = "/registro")}
            >
              Registrar
            </button>
            <button
              className="login-btn"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
