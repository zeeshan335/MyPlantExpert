import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import ZegoVideoCall from "../components/ZegoVideoCall";
import "./ExpertDashboard.css";

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [report, setReport] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedConsultationForCall, setSelectedConsultationForCall] =
    useState(null);

  // Hide navbar on mount and show on unmount
  useEffect(() => {
    // Find and hide the navbar
    const navbar = document.querySelector("nav");
    const header = document.querySelector("header");

    if (navbar) {
      navbar.style.display = "none";
    }
    if (header) {
      header.style.display = "none";
    }

    // Cleanup: show navbar when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = "";
      }
      if (header) {
        header.style.display = "";
      }
    };
  }, []);

  useEffect(() => {
    const expertData = localStorage.getItem("expertUser");
    if (!expertData) {
      navigate("/expert-login");
      return;
    }
    setExpert(JSON.parse(expertData));
  }, [navigate]);

  useEffect(() => {
    if (expert) {
      loadConsultations();
    }
  }, [expert]);

  const loadConsultations = async () => {
    try {
      const consultationsRef = collection(db, "consultations");
      const querySnapshot = await getDocs(consultationsRef);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setConsultations(data);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("expertUser");
    navigate("/expert-login");
  };

  const getFilteredConsultations = () => {
    if (filter === "all") return consultations;
    return consultations.filter((c) => c.status === filter);
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { color: "#2196f3", text: "Scheduled", emoji: "📅" },
      active: { color: "#4caf50", text: "Active", emoji: "🟢" },
      completed: { color: "#9e9e9e", text: "Completed", emoji: "✅" },
      cancelled: { color: "#f44336", text: "Cancelled", emoji: "❌" },
    };
    return badges[status] || badges.scheduled;
  };

  const handleCompleteAppointment = (consultation) => {
    setSelectedConsultation(consultation);
    setReport("");
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!report.trim()) {
      alert("Please write a consultation report before completing.");
      return;
    }

    setSubmitting(true);

    try {
      const consultationRef = doc(db, "consultations", selectedConsultation.id);
      await updateDoc(consultationRef, {
        status: "completed",
        expertReport: report,
        completedAt: new Date().toISOString(),
        completedBy: expert.name,
      });

      alert("✅ Appointment completed successfully!");

      // Reload consultations
      await loadConsultations();

      // Close modal
      setShowReportModal(false);
      setSelectedConsultation(null);
      setReport("");
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert("❌ Failed to complete appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeReportModal = () => {
    if (window.confirm("Are you sure? Your report will be lost.")) {
      setShowReportModal(false);
      setSelectedConsultation(null);
      setReport("");
    }
  };

  const startVideoCall = (consultation) => {
    setSelectedConsultationForCall(consultation);
    setShowVideoCall(true);
  };

  const handleVideoCallEnd = () => {
    setShowVideoCall(false);
    setSelectedConsultationForCall(null);
  };

  if (showVideoCall && selectedConsultationForCall) {
    return (
      <ZegoVideoCall
        consultation={selectedConsultationForCall}
        userType="expert"
        onEnd={handleVideoCallEnd}
      />
    );
  }

  if (loading) {
    return (
      <div className="expert-dashboard-container">
        <div className="loading">Loading consultations...</div>
      </div>
    );
  }

  return (
    <div className="expert-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Expert Dashboard</h1>
          <p>Welcome, Plant Expert</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{consultations.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>
              {consultations.filter((c) => c.status === "scheduled").length}
            </h3>
            <p>Scheduled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>
              {consultations.filter((c) => c.status === "completed").length}
            </h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All ({consultations.length})
        </button>
        <button
          className={filter === "scheduled" ? "active" : ""}
          onClick={() => setFilter("scheduled")}
        >
          Scheduled (
          {consultations.filter((c) => c.status === "scheduled").length})
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed (
          {consultations.filter((c) => c.status === "completed").length})
        </button>
      </div>

      <div className="consultations-list">
        {getFilteredConsultations().length === 0 ? (
          <div className="no-consultations">
            <p>No consultations found</p>
          </div>
        ) : (
          getFilteredConsultations().map((consultation) => {
            const badge = getStatusBadge(consultation.status);
            return (
              <div key={consultation.id} className="consultation-card">
                <div className="consultation-header">
                  <div>
                    <h3>{consultation.categoryName}</h3>
                    <p className="patient-name">{consultation.userName}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: badge.color }}
                  >
                    {badge.text}
                  </span>
                </div>
                <div className="consultation-details">
                  <div className="detail-item">
                    <strong>Date:</strong> {consultation.date}
                  </div>
                  <div className="detail-item">
                    <strong>Time:</strong> {consultation.slot}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {consultation.userEmail}
                  </div>
                  <div className="detail-item">
                    <strong>WhatsApp:</strong>{" "}
                    {consultation.whatsappNumber || "Not provided"}
                  </div>
                </div>

                {consultation.status === "scheduled" && (
                  <>
                    <div
                      className="whatsapp-call-note"
                      style={{
                        background: "#e8f5e9",
                        padding: "1rem",
                        borderRadius: "8px",
                        marginTop: "1rem",
                        border: "1px solid #4caf50",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "#2e7d32",
                          fontWeight: "500",
                        }}
                      >
                        📞 Call the user on WhatsApp at the scheduled
                        appointment time:{" "}
                        <strong>{consultation.whatsappNumber}</strong>
                      </p>
                    </div>

                    <div className="consultation-actions">
                      <button
                        className="complete-btn"
                        onClick={() => handleCompleteAppointment(consultation)}
                      >
                        ✓ Mark as Completed
                      </button>
                    </div>
                  </>
                )}

                {consultation.status === "completed" &&
                  consultation.expertReport && (
                    <div className="expert-report-section">
                      <h4>Expert Report:</h4>
                      <p>{consultation.expertReport}</p>
                      <small>
                        Completed on:{" "}
                        {new Date(consultation.completedAt).toLocaleString()}
                      </small>
                    </div>
                  )}

                {/* User Review Display */}
                {consultation.status === "completed" &&
                  consultation.userReview && (
                    <div className="user-review-section">
                      <h4>⭐ User Review</h4>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= consultation.userRating
                                ? "star-filled"
                                : "star-empty"
                            }
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-text">
                          ({consultation.userRating}/5)
                        </span>
                      </div>
                      <p className="review-comment">
                        {consultation.userReview}
                      </p>
                      <small>
                        Reviewed on:{" "}
                        {new Date(consultation.reviewedAt).toLocaleString()}
                      </small>
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <div className="modal-header">
              <h2>Complete Appointment</h2>
              <button className="close-btn" onClick={closeReportModal}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="appointment-summary">
                <p>
                  <strong>Patient:</strong> {selectedConsultation.userName}
                </p>
                <p>
                  <strong>Category:</strong> {selectedConsultation.categoryName}
                </p>
                <p>
                  <strong>Date:</strong> {selectedConsultation.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedConsultation.slot}
                </p>
              </div>

              <div className="report-input-section">
                <label>
                  <strong>Consultation Report (Required):</strong>
                </label>
                <textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Write your consultation findings, recommendations, and treatment plan here..."
                  rows="8"
                  className="report-textarea"
                />
                <small>{report.length} characters</small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-modal-btn"
                onClick={closeReportModal}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="submit-report-btn"
                onClick={submitReport}
                disabled={submitting || !report.trim()}
              >
                {submitting ? "Submitting..." : "Complete & Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;
