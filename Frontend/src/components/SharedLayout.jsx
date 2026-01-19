import React from "react";
import { Outlet } from "react-router-dom";
import SubNavbar from "./SubNavbar";
import "./SubNavbar.css"; // New CSS file we'll create

const SharedLayout = () => {
  return (
    <div className="shared-layout">
      {/* Move SubNavbar to the top */}
      <SubNavbar />

      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
};

export default SharedLayout;
