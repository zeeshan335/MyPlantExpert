import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      {/* Add divider above footer */}
      <div className="footer-divider"></div>

      <footer className="footer">
        <div className="footer-simple">
          <p>
            &copy; {new Date().getFullYear()} MyPlantExpert. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
