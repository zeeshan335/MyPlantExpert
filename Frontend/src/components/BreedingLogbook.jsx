import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getBreedingLogs,
  deleteBreedingLog,
} from "../firebase/breedingService";
import "./BreedingFeature.css";

const BreedingLogbook = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadBreedingLogs();
  }, [currentUser]);

  const loadBreedingLogs = async () => {
    if (!currentUser) {
      console.log("No user logged in, redirecting to login");
      navigate("/login");
      return;
    }

    setLoading(true);
    console.log("Loading breeding logs for:", currentUser.email);

    try {
      const logs = await getBreedingLogs(currentUser.email);
      console.log("Loaded logs:", logs);
      setEntries(logs);
    } catch (error) {
      console.error("Error loading breeding logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    const response = await deleteBreedingLog(logId);
    if (response.success) {
      await loadBreedingLogs();
      alert("Entry deleted successfully!");
    } else {
      alert("Failed to delete entry. Please try again.");
    }
  };

  const viewDetails = (entry) => {
    setSelectedEntry(entry);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      "In Progress": "#2196f3",
      Success: "#4caf50",
      Failed: "#f44336",
      Completed: "#28a745",
    };
    return colors[status] || "#999";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="breeding-feature-container">
        <div className="feature-content">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="simple-loader"></div>
            <p>Loading your breeding logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="breeding-feature-container">
      <button
        className="back-btn"
        onClick={() => navigate("/breeding-planner")}
      >
        Back to Planner
      </button>

      <div className="feature-content">
        <h1>Breeding Logbook</h1>
        <p>Track and manage your breeding experiments</p>

        <button
          className="add-entry-btn"
          onClick={() => navigate("/breeding-planner/outcome")}
          style={{ marginBottom: "2rem" }}
        >
          + Create New Breeding Experiment
        </button>

        {entries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "#f9f9f9",
              borderRadius: "12px",
              marginTop: "2rem",
            }}
          >
            <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>
              No Breeding Logs Yet
            </h3>
            <p style={{ color: "#999" }}>
              Start a breeding experiment to create your first log entry!
            </p>
          </div>
        ) : (
          <div className="logbook-entries">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="logbook-entry"
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid #e8e8e8",
                }}
              >
                <div
                  className="entry-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    borderBottom: "2px solid #e8f5e9",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid #4caf50",
                      boxShadow: "0 2px 4px rgba(76, 175, 80, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#2e7d32",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Created On
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "#0f2d1a",
                        fontWeight: "700",
                      }}
                    >
                      {formatDate(entry.createdAt)}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#0f2d1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {entry.parentAName}{" "}
                    <span style={{ color: "#4caf50", fontSize: "1.3rem" }}>
                      ×
                    </span>{" "}
                    {entry.parentBName}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "0.8rem",
                    }}
                  >
                    <span
                      style={{
                        background: "#e8f5e9",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        color: "#2e7d32",
                        fontWeight: "600",
                      }}
                    >
                      {entry.category}
                    </span>
                    <span
                      style={{
                        background:
                          entry.confidenceLevel === "High"
                            ? "#e8f5e9"
                            : entry.confidenceLevel === "Medium"
                            ? "#fff3e0"
                            : "#ffebee",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        color:
                          entry.confidenceLevel === "High"
                            ? "#2e7d32"
                            : entry.confidenceLevel === "Medium"
                            ? "#e65100"
                            : "#c62828",
                        fontWeight: "600",
                      }}
                    >
                      Confidence: {entry.confidenceLevel} (
                      {entry.confidenceScore}%)
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Growth Type: {entry.growthType} | Height:{" "}
                    {entry.heightRange}
                  </p>
                </div>

                <div
                  style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}
                >
                  <button
                    onClick={() => viewDetails(entry)}
                    style={{
                      flex: 1,
                      background: "#2196f3",
                      color: "white",
                      border: "none",
                      padding: "0.7rem",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "0.7rem 1.2rem",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedEntry && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px" }}
          >
            <div className="modal-header">
              <h2>Breeding Experiment Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>

            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #0f2d1a 0%, #1a4d2e 100%)",
                  color: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                >
                  {selectedEntry.parentAName}{" "}
                  <span style={{ color: "#4caf50" }}>×</span>{" "}
                  {selectedEntry.parentBName}
                </h3>
                <p style={{ margin: "0", opacity: 0.9, color: "white" }}>
                  Category: {selectedEntry.category}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f2d1a",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Height Range
                  </strong>
                  <span>{selectedEntry.heightRange}</span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f2d1a",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Growth Type
                  </strong>
                  <span>{selectedEntry.growthType}</span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f2d1a",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Water Needs
                  </strong>
                  <span>{selectedEntry.water}</span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f2d1a",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Sunlight
                  </strong>
                  <span>{selectedEntry.sunlight}</span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f2d1a",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Climate
                  </strong>
                  <span>{selectedEntry.climate}</span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f2d1a",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Soil Type
                  </strong>
                  <span>{selectedEntry.soil}</span>
                </div>
              </div>

              <div
                style={{
                  background: "#e8f5e9",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "2px solid #4caf50",
                }}
              >
                <strong style={{ color: "#2e7d32" }}>Confidence Level: </strong>
                <span style={{ fontWeight: "600", color: "#2e7d32" }}>
                  {selectedEntry.confidenceLevel} (
                  {selectedEntry.confidenceScore}%)
                </span>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ color: "#0f2d1a" }}>Created: </strong>
                <span>{formatDate(selectedEntry.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingLogbook;
