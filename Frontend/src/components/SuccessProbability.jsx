import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { plantsData } from "../data/NewPlantData";
import { saveProbabilityResult } from "../firebase/probabilityService";
import "./BreedingFeature.css";

const SuccessProbability = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [parentA, setParentA] = useState(null);
  const [parentB, setParentB] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [comingFromOutcome, setComingFromOutcome] = useState(false);

  useEffect(() => {
    // Check if hybrid data was passed from HybridOutcome
    if (location.state?.hybridData) {
      const { parentAId, parentBId } = location.state.hybridData;
      const plantA = plantsData.find((p) => p.id === parentAId);
      const plantB = plantsData.find((p) => p.id === parentBId);

      if (plantA && plantB) {
        setParentA(plantA);
        setParentB(plantB);
        calculateProbability(plantA, plantB);
        setComingFromOutcome(true); // Mark that we came from HybridOutcome
      }
    }
  }, [location.state]);

  // Get filtered plants for Parent B based on Parent A's category
  const getFilteredParentB = () => {
    if (!parentA) return [];
    return plantsData.filter(
      (plant) => plant.category === parentA.category && plant.id !== parentA.id
    );
  };

  // Calculate success probability using weighted formula
  const calculateProbability = (plantA, plantB) => {
    setError("");

    // Calculate individual compatibility factors (0 or 1)
    const F = plantA.family === plantB.family ? 1 : 0;
    const C = plantA.climate === plantB.climate ? 1 : 0;
    const S = plantA.soil === plantB.soil ? 1 : 0;
    const L = plantA.sunlight === plantB.sunlight ? 1 : 0;
    const G = plantA.growthType === plantB.growthType ? 1 : 0;

    // Calculate height compatibility
    const A_avg = (plantA.heightMin + plantA.heightMax) / 2;
    const B_avg = (plantB.heightMin + plantB.heightMax) / 2;
    const H = Math.abs(A_avg - B_avg) <= 20 ? 1 : 0;

    // Calculate weighted success score (0-100)
    const successScore = 30 * F + 20 * C + 15 * S + 15 * L + 10 * G + 10 * H;

    // Determine success level
    let successLevel, levelColor, levelDescription;
    if (successScore >= 75) {
      successLevel = "High Success Probability";
      levelColor = "#4caf50";
      levelDescription =
        "Excellent compatibility! These plants are highly likely to produce viable hybrids with desirable traits.";
    } else if (successScore >= 45) {
      successLevel = "Moderate Success Probability";
      levelColor = "#ff9800";
      levelDescription =
        "Good compatibility with some differences. Success is possible with proper care and optimal conditions.";
    } else {
      successLevel = "Low Success Probability";
      levelColor = "#f44336";
      levelDescription =
        "Limited compatibility. Hybridization may be challenging and require advanced techniques and expert care.";
    }

    setResult({
      parentAName: plantA.name,
      parentBName: plantB.name,
      category: plantA.category,
      successScore,
      successLevel,
      levelColor,
      levelDescription,
      factors: {
        family: {
          match: F === 1,
          label: "Family Match",
          value:
            plantA.family === plantB.family
              ? `${plantA.family}`
              : `${plantA.family} ≠ ${plantB.family}`,
        },
        climate: {
          match: C === 1,
          label: "Climate Match",
          value:
            plantA.climate === plantB.climate
              ? `${plantA.climate}`
              : `${plantA.climate} ≠ ${plantB.climate}`,
        },
        soil: {
          match: S === 1,
          label: "Soil Match",
          value:
            plantA.soil === plantB.soil
              ? `${plantA.soil}`
              : `${plantA.soil} ≠ ${plantB.soil}`,
        },
        sunlight: {
          match: L === 1,
          label: "Sunlight Match",
          value:
            plantA.sunlight === plantB.sunlight
              ? `${plantA.sunlight}`
              : `${plantA.sunlight} ≠ ${plantB.sunlight}`,
        },
        growthType: {
          match: G === 1,
          label: "Growth Type Match",
          value:
            plantA.growthType === plantB.growthType
              ? `${plantA.growthType}`
              : `${plantA.growthType} ≠ ${plantB.growthType}`,
        },
        height: {
          match: H === 1,
          label: "Height Compatibility",
          value:
            H === 1
              ? `Similar (±20cm difference)`
              : `Different (>${Math.abs(A_avg - B_avg).toFixed(
                  0
                )}cm difference)`,
        },
      },
      weights: {
        family: 30,
        climate: 20,
        soil: 15,
        sunlight: 15,
        growthType: 10,
        height: 10,
      },
    });
  };

  const handleCalculate = () => {
    if (!parentA || !parentB) {
      setError("Please select both parent plants");
      return;
    }

    if (parentA.category !== parentB.category) {
      setError("Cross-breeding is only allowed within the same category.");
      setResult(null);
      return;
    }

    calculateProbability(parentA, parentB);
  };

  const handleReset = () => {
    setParentA(null);
    setParentB(null);
    setResult(null);
    setError("");
  };

  const handleSaveResult = async () => {
    if (!currentUser) {
      alert("Please login to save probability results");
      navigate("/login");
      return;
    }

    if (!result) {
      alert("No result to save");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const resultData = {
        parentAId: parentA.id,
        parentAName: result.parentAName,
        parentBId: parentB.id,
        parentBName: result.parentBName,
        category: result.category,
        successScore: result.successScore,
        successLevel: result.successLevel,
        levelColor: result.levelColor,
        levelDescription: result.levelDescription,
        factors: result.factors,
        weights: result.weights,
      };

      const response = await saveProbabilityResult(
        currentUser.email,
        resultData
      );

      if (response.success) {
        setSaveSuccess(true);
        alert("✅ Probability result saved successfully!");
      } else {
        alert("Failed to save result. Please try again.");
      }
    } catch (error) {
      console.error("Error saving result:", error);
      alert("An error occurred while saving the result.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="breeding-feature-container">
      <button
        className="back-btn"
        onClick={() => navigate("/breeding-planner")}
      >
        ← Back to Planner
      </button>

      <div className="feature-content">
        <div className="feature-header">
          <h1>Success Probability Meter</h1>
          <p className="feature-subtitle">
            Calculate breeding success rates based on biological and
            environmental compatibility
          </p>
        </div>

        {error && (
          <div className="error-alert-modern">
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Only show input section if NOT coming from HybridOutcome */}
        {!comingFromOutcome && (
          <div className="input-section-modern">
            <div className="input-grid">
              {/* Parent Plant A */}
              <div className="input-group-modern">
                <label className="modern-label">
                  Parent Plant A<span className="required-badge">Required</span>
                </label>
                <select
                  value={parentA?.id || ""}
                  onChange={(e) => {
                    const selected = plantsData.find(
                      (p) => p.id === e.target.value
                    );
                    setParentA(selected || null);
                    setParentB(null);
                    setResult(null);
                    setError("");
                  }}
                  className="modern-select"
                >
                  <option value="">-- Select Parent A --</option>
                  {plantsData.map((plant) => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name} ({plant.category})
                    </option>
                  ))}
                </select>
                {parentA && (
                  <div className="plant-info-card">
                    <div className="info-row">
                      <span className="info-label">Category:</span>
                      <span className="info-value">{parentA.category}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Family:</span>
                      <span className="info-value">{parentA.family}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cross Symbol */}
              <div className="cross-symbol">
                <div className="cross-circle">×</div>
                <div className="cross-line"></div>
              </div>

              {/* Parent Plant B */}
              <div className="input-group-modern">
                <label className="modern-label">
                  Parent Plant B<span className="required-badge">Required</span>
                </label>
                <select
                  value={parentB?.id || ""}
                  onChange={(e) => {
                    const selected = plantsData.find(
                      (p) => p.id === e.target.value
                    );
                    setParentB(selected || null);
                    setResult(null);
                    setError("");
                  }}
                  disabled={!parentA}
                  className="modern-select"
                >
                  <option value="">
                    {!parentA
                      ? "-- First select Parent A --"
                      : "-- Select Parent B --"}
                  </option>
                  {getFilteredParentB().map((plant) => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name}
                    </option>
                  ))}
                </select>
                {parentA && getFilteredParentB().length === 0 && (
                  <div className="warning-message">
                    <span className="warning-icon">⚠️</span>
                    No compatible plants found in the same category
                  </div>
                )}
                {parentB && (
                  <div className="plant-info-card">
                    <div className="info-row">
                      <span className="info-label">Category:</span>
                      <span className="info-value">{parentB.category}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Family:</span>
                      <span className="info-value">{parentB.family}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="action-buttons-modern">
              <button
                className="calculate-btn"
                onClick={handleCalculate}
                disabled={!parentA || !parentB}
              >
                Calculate Success Probability
              </button>
              {(parentA || parentB || result) && (
                <button className="reset-btn" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="result-section-modern">
            <div className="result-header-gradient">
              <div className="result-title-section">
                <h2 className="result-main-title">
                  Success Probability Analysis
                </h2>
                <p className="hybrid-formula">
                  {result.parentAName} <span className="formula-symbol">×</span>{" "}
                  {result.parentBName}
                </p>
                <div className="category-badge-large">{result.category}</div>
              </div>
            </div>

            {/* Success Score Display */}
            <div className="confidence-section">
              <div className="confidence-header">
                <h3>Overall Compatibility Score</h3>
                <div
                  className="confidence-level"
                  style={{ color: result.levelColor }}
                >
                  {result.successLevel}
                </div>
              </div>
              <div className="confidence-bar-container">
                <div
                  className="confidence-bar-fill"
                  style={{
                    width: `${result.successScore}%`,
                    background: `linear-gradient(90deg, ${result.levelColor}, ${result.levelColor}dd)`,
                  }}
                >
                  <span className="confidence-score">
                    {result.successScore}%
                  </span>
                </div>
              </div>
              <div className="confidence-labels">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  marginTop: "1rem",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                }}
              >
                {result.levelDescription}
              </p>
            </div>

            {/* Compatibility Factors */}
            <div className="traits-section">
              <h3 className="section-title">Compatibility Factors Analysis</h3>
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {Object.entries(result.factors).map(([key, factor]) => (
                  <div
                    key={key}
                    style={{
                      background: factor.match ? "#e8f5e9" : "#ffebee",
                      border: `2px solid ${
                        factor.match ? "#4caf50" : "#f44336"
                      }`,
                      borderRadius: "12px",
                      padding: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
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
                          marginBottom: "0.5rem",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            color: "#0f2d1a",
                            fontSize: "1.1rem",
                          }}
                        >
                          {factor.label}
                        </h4>
                        <span
                          style={{
                            background: factor.match ? "#4caf50" : "#f44336",
                            color: "white",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          Weight: {result.weights[key]}%
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: "#666",
                          fontSize: "0.95rem",
                        }}
                      >
                        {factor.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="info-note-modern">
              <div className="note-content">
                <strong>How Success Probability is Calculated:</strong> The
                compatibility score is calculated using a weighted formula:
                <br />
                <br />
                <strong>Family Match (30%):</strong> Same plant family indicates
                genetic compatibility
                <br />
                <strong>Climate Match (20%):</strong> Similar climate
                requirements ensure environmental compatibility
                <br />
                <strong>Soil Match (15%):</strong> Compatible soil preferences
                support healthy growth
                <br />
                <strong>Sunlight Match (15%):</strong> Similar light
                requirements simplify care
                <br />
                <strong>Growth Type Match (10%):</strong> Similar growth
                patterns aid in cultivation
                <br />
                <strong>Height Compatibility (10%):</strong> Similar mature
                heights indicate balanced growth
                <br />
                <br />
                <strong>Success Levels:</strong>
                <br />
                • High (75-100%): Excellent compatibility, highly recommended
                for breeding
                <br />
                • Moderate (45-74%): Good potential with proper care and
                conditions
                <br />• Low (0-44%): Challenging, requires expert knowledge and
                techniques
              </div>
            </div>

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "2rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleSaveResult}
                disabled={saving || saveSuccess}
                style={{
                  background: saveSuccess ? "#28a745" : "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: saving || saveSuccess ? "not-allowed" : "pointer",
                  opacity: saving || saveSuccess ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                }}
              >
                {saving
                  ? "Saving..."
                  : saveSuccess
                  ? "✓ Saved!"
                  : "💾 Save Result"}
              </button>

              {/* Show "Back to Hybrid Outcome" if coming from outcome page */}
              {comingFromOutcome ? (
                <button
                  onClick={() => navigate("/breeding-planner/outcome")}
                  style={{
                    background: "#2196f3",
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                  }}
                >
                  ← Back to Hybrid Outcome
                </button>
              ) : null}

              {saveSuccess && (
                <button
                  onClick={() => navigate("/breeding-planner")}
                  style={{
                    background: "#9c27b0",
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(156, 39, 176, 0.3)",
                  }}
                >
                  View in Planner →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show message if no result and coming from outcome */}
        {!result && comingFromOutcome && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "#f9f9f9",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>
              Calculating Probability...
            </h3>
            <p style={{ color: "#999" }}>
              Please wait while we analyze the compatibility.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessProbability;
