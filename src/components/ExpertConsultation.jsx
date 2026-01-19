import React from "react";
import { useNavigate } from "react-router-dom";

const ExpertConsultation = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Expert Consultation</h1>
      <button onClick={() => navigate("/my-bookings")} className="">
        My Bookings
      </button>
      {/* ...existing code... */}
    </div>
  );
};

export default ExpertConsultation;
