import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getProbabilityResults,
  deleteProbabilityResult,
} from "../firebase/probabilityService";
import "./BreedingPlanner.css";

const BreedingPlanner = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [savedResults, setSavedResults] = useState([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadSavedResults();
  }, [currentUser]);

  const loadSavedResults = async () => {
    if (!currentUser) return;

    try {
      const results = await getProbabilityResults(currentUser.email);
      setSavedResults(results);
    } catch (error) {
      console.error("Error loading probability results:", error);
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this result?")) {
      return;
    }

    const response = await deleteProbabilityResult(resultId);
    if (response.success) {
      await loadSavedResults();
      alert("Result deleted successfully!");
    } else {
      alert("Failed to delete result. Please try again.");
    }
  };

  const viewResultDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
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

  const features = [
    {
      id: 1,
      title: "Hybrid Outcome Estimator",
      description: "Predict potential hybrid characteristics and traits",
      route: "/breeding-planner/outcome",
      color: "#4caf50",
    },
    {
      id: 2,
      title: "Success Probability Meter",
      description: "View your saved breeding probability analyses",
      color: "#2196f3",
      savedCount: savedResults.length,
      onViewSaved: () => setShowResultsModal(true),
      viewOnly: true, // Mark this as view-only
    },
    {
      id: 3,
      title: "Growth Condition Advisor",
      description: "Get optimal environmental conditions for breeding",
      route: "/breeding-planner/conditions",
      color: "#ff9800",
    },
    {
      id: 4,
      title: "Breeding Logbook",
      description: "Track and manage your breeding experiments",
      route: "/breeding-planner/logbook",
      color: "#9c27b0",
    },
    {
      id: 5,
      title: "Breeding Workflow Guide",
      description: "Step-by-step breeding process guidance",
      route: "/breeding-planner/workflow",
      color: "#f44336",
    },
  ];

  return (
    <div className="breeding-planner-container">
      <div className="planner-header">
        <h1>Smart Breeding Planner</h1>
        <p>Comprehensive plant breeding assistance system</p>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "column",
              }}
            >
              {/* Only show "Open Tool" button if not viewOnly */}
              {!feature.viewOnly && (
                <button
                  className="feature-btn"
                  style={{ background: feature.color }}
                  onClick={() => navigate(feature.route)}
                >
                  Open Tool →
                </button>
              )}

              {/* Show "View Saved Results" button for Success Probability */}
              {feature.onViewSaved && (
                <button
                  className="feature-btn"
                  style={{
                    background: feature.viewOnly ? feature.color : "white",
                    color: feature.viewOnly ? "white" : feature.color,
                    border: feature.viewOnly
                      ? "none"
                      : `2px solid ${feature.color}`,
                  }}
                  onClick={feature.onViewSaved}
                >
                  {feature.viewOnly
                    ? "View Saved Results"
                    : "View Saved Results"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Saved Results Modal */}
      {showResultsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowResultsModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px" }}
          >
            <div className="modal-header">
              <h2>Saved Probability Results</h2>
              <button
                className="close-btn"
                onClick={() => setShowResultsModal(false)}
              >
                ×
              </button>
            </div>

            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {savedResults.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "2rem",
                  }}
                >
                  No saved probability results yet.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {savedResults.map((result) => (
                    <div
                      key={result.id}
                      style={{
                        background: "white",
                        border: "2px solid #e8e8e8",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div
                        style={{
                          background: `${result.levelColor}20`,
                          padding: "0.8rem",
                          borderRadius: "8px",
                          marginBottom: "1rem",
                          border: `2px solid ${result.levelColor}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "2rem",
                            textAlign: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {result.successScore}%
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            color: result.levelColor,
                            fontWeight: "700",
                            fontSize: "0.9rem",
                          }}
                        >
                          {result.successLevel}
                        </div>
                      </div>

                      <h3
                        style={{
                          color: "#0f2d1a",
                          margin: "0 0 0.5rem 0",
                          fontSize: "1.1rem",
                        }}
                      >
                        {result.parentAName} × {result.parentBName}
                      </h3>

                      <span
                        style={{
                          background: "#e8f5e9",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          color: "#2e7d32",
                          fontWeight: "600",
                          display: "inline-block",
                          marginBottom: "0.8rem",
                        }}
                      >
                        {result.category}
                      </span>

                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.85rem",
                          marginBottom: "1rem",
                        }}
                      >
                        Saved: {formatDate(result.createdAt)}
                      </p>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => viewResultDetails(result)}
                          style={{
                            flex: 1,
                            background: "#2196f3",
                            color: "white",
                            border: "none",
                            padding: "0.6rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteResult(result.id)}
                          style={{
                            background: "#f44336",
                            color: "white",
                            border: "none",
                            padding: "0.6rem 1rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
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
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedResult && (
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
              <h2>Probability Analysis Details</h2>
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
                  background: `${selectedResult.levelColor}20`,
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                  border: `2px solid ${selectedResult.levelColor}`,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.5rem",
                    color: "#0f2d1a",
                  }}
                >
                  {selectedResult.parentAName} × {selectedResult.parentBName}
                </h3>
                <p style={{ margin: "0 0 1rem 0", color: "#666" }}>
                  Category: {selectedResult.category}
                </p>
                <div
                  style={{
                    fontSize: "2.5rem",
                    textAlign: "center",
                    color: selectedResult.levelColor,
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                  }}
                >
                  {selectedResult.successScore}%
                </div>
                <div
                  style={{
                    textAlign: "center",
                    color: selectedResult.levelColor,
                    fontWeight: "700",
                    fontSize: "1.2rem",
                  }}
                >
                  {selectedResult.successLevel}
                </div>
              </div>

              <div
                style={{
                  background: "#f9f9f9",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedResult.levelDescription}
                </p>
              </div>

              <h4
                style={{
                  color: "#0f2d1a",
                  marginBottom: "1rem",
                }}
              >
                Compatibility Factors
              </h4>

              <div style={{ display: "grid", gap: "0.8rem" }}>
                {Object.entries(selectedResult.factors).map(([key, factor]) => (
                  <div
                    key={key}
                    style={{
                      background: factor.match ? "#e8f5e9" : "#ffebee",
                      border: `2px solid ${
                        factor.match ? "#4caf50" : "#f44336"
                      }`,
                      borderRadius: "8px",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        color: factor.match ? "#4caf50" : "#f44336",
                      }}
                    >
                      {factor.match ? "✔" : "✖"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.3rem",
                        }}
                      >
                        <strong style={{ color: "#0f2d1a" }}>
                          {factor.label}
                        </strong>
                        <span
                          style={{
                            background: factor.match ? "#4caf50" : "#f44336",
                            color: "white",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {selectedResult.weights[key]}%
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: "#666",
                          fontSize: "0.9rem",
                        }}
                      >
                        {factor.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                }}
              >
                <strong style={{ color: "#0f2d1a" }}>Saved: </strong>
                <span>{formatDate(selectedResult.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingPlanner;
