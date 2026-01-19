import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="main-header">
      <div className="logo">MyPlantExpert</div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? "Close" : "Menu"}
      </button>
      <nav className={`main-nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/plant-identification" className="nav-link">
              Plant Identification
            </NavLink>
          </li>
          <li>
            <NavLink to="/disease-detection" className="nav-link">
              Disease Detection
            </NavLink>
          </li>
          <li>
            <NavLink to="/insect-identification" className="nav-link">
              Insect Identification
            </NavLink>
          </li>
          <li>
            <NavLink to="/plant-database" className="nav-link">
              Plant Database
            </NavLink>
          </li>
          {/* ...other existing menu items... */}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
