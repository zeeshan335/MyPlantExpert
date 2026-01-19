import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantsData } from "../data/NewPlantData";
import "./BreedingFeature.css";
import { useAuth } from "../context/AuthContext";
import { saveBreedingLog } from "../firebase/breedingService";

const HybridOutcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [parentA, setParentA] = useState(null);
  const [parentB, setParentB] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Debug: Log the number of plants loaded
  React.useEffect(() => {
    console.log(`Total plants loaded: ${plantsData.length}`);
    console.log("Categories:", [...new Set(plantsData.map((p) => p.category))]);
    console.log("Plants per category:", {
      Vegetables: plantsData.filter((p) => p.category === "Vegetables").length,
      Fruits: plantsData.filter((p) => p.category === "Fruits").length,
      Herbs: plantsData.filter((p) => p.category === "Herbs").length,
      Flowers: plantsData.filter((p) => p.category === "Flowers").length,
    });
  }, []);

  // Get filtered plants for Parent B based on Parent A's category
  const getFilteredParentB = () => {
    if (!parentA) return [];
    return plantsData.filter(
      (plant) => plant.category === parentA.category && plant.id !== parentA.id
    );
  };

  // Calculate hybrid height
  const calculateHeight = (plantA, plantB) => {
    const A_avg = (plantA.heightMin + plantA.heightMax) / 2;
    const B_avg = (plantB.heightMin + plantB.heightMax) / 2;
    const baseHeight = (A_avg + B_avg) / 2;

    return {
      min: Math.round(baseHeight - baseHeight * 0.1),
      max: Math.round(baseHeight + baseHeight * 0.1),
      A_avg,
      B_avg,
    };
  };

  // Calculate growth type
  const calculateGrowthType = (plantA, plantB) => {
    if (plantA.growthType === plantB.growthType) {
      return plantA.growthType;
    }
    return "Mixed Growth Pattern";
  };

  // Calculate water requirement
  const calculateWater = (plantA, plantB) => {
    if (plantA.water === plantB.water) {
      return plantA.water;
    }
    return "Moderate";
  };

  // Calculate sunlight requirement
  const calculateSunlight = (plantA, plantB) => {
    if (plantA.sunlight === plantB.sunlight) {
      return plantA.sunlight;
    }
    return "Partial to Full Sun";
  };

  // Calculate climate suitability
  const calculateClimate = (plantA, plantB) => {
    if (plantA.climate === plantB.climate) {
      return plantA.climate;
    }
    return `${plantA.climate} to ${plantB.climate}`;
  };

  // Calculate soil preference
  const calculateSoil = (plantA, plantB) => {
    if (plantA.soil === plantB.soil) {
      return plantA.soil;
    }
    return `${plantA.soil} or ${plantB.soil}`;
  };

  // Calculate confidence score
  const calculateConfidence = (plantA, plantB, height) => {
    let score = 0;

    // Family match
    if (plantA.family === plantB.family) {
      score += 25;
    }

    // Climate match
    if (plantA.climate === plantB.climate) {
      score += 20;
    }

    // Soil match
    if (plantA.soil === plantB.soil) {
      score += 15;
    }

    // Sunlight match
    if (plantA.sunlight === plantB.sunlight) {
      score += 15;
    }

    // Growth type match
    if (plantA.growthType === plantB.growthType) {
      score += 15;
    }

    // Height similarity
    if (Math.abs(height.A_avg - height.B_avg) <= 20) {
      score += 10;
    }

    // Determine confidence level
    if (score >= 80) {
      return { level: "High", score, color: "#4caf50" };
    } else if (score >= 50) {
      return { level: "Medium", score, color: "#ff9800" };
    } else {
      return { level: "Low", score, color: "#f44336" };
    }
  };

  const handleEstimate = () => {
    setError("");

    if (!parentA || !parentB) {
      setError("Please select both parent plants");
      return;
    }

    // Check if same category
    if (parentA.category !== parentB.category) {
      setError("Cross-breeding is only allowed within the same category.");
      setResult(null);
      return;
    }

    // Calculate all hybrid characteristics
    const height = calculateHeight(parentA, parentB);
    const growthType = calculateGrowthType(parentA, parentB);
    const water = calculateWater(parentA, parentB);
    const sunlight = calculateSunlight(parentA, parentB);
    const climate = calculateClimate(parentA, parentB);
    const soil = calculateSoil(parentA, parentB);
    const confidence = calculateConfidence(parentA, parentB, height);

    setResult({
      parentAName: parentA.name,
      parentBName: parentB.name,
      category: parentA.category,
      height: `${height.min} - ${height.max} cm`,
      growthType,
      water,
      sunlight,
      climate,
      soil,
      confidence,
    });
  };

  const handleReset = () => {
    setParentA(null);
    setParentB(null);
    setResult(null);
    setError("");
  };

  const handleSaveResult = async () => {
    if (!currentUser) {
      alert("Please login to save breeding results");
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
      const logData = {
        parentAId: parentA.id,
        parentAName: result.parentAName,
        parentBId: parentB.id,
        parentBName: result.parentBName,
        category: result.category,
        heightRange: result.height,
        growthType: result.growthType,
        water: result.water,
        sunlight: result.sunlight,
        climate: result.climate,
        soil: result.soil,
        confidenceLevel: result.confidence.level,
        confidenceScore: result.confidence.score,
        status: "In Progress",
      };

      const response = await saveBreedingLog(currentUser.email, logData);

      if (response.success) {
        setSaveSuccess(true);
        alert("✅ Breeding result saved successfully!");
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

  // Navigate to Growth Conditions with result data
  const handleGetCareAdvisory = () => {
    if (!result) {
      alert("No result to get advisory for");
      return;
    }

    // Prepare hybrid data for care advisory
    const hybridData = {
      name: `${result.parentAName} × ${result.parentBName}`,
      category: result.category,
      heightRange: result.height,
      growthType: result.growthType,
      water: result.water,
      sunlight: result.sunlight,
      climate: result.climate,
      soil: result.soil,
      confidenceLevel: result.confidence.level,
      confidenceScore: result.confidence.score,
      parentAName: result.parentAName,
      parentBName: result.parentBName,
    };

    // Navigate to Growth Conditions with hybrid data
    navigate("/breeding-planner/conditions", { state: { hybridData } });
  };

  // Navigate to Success Probability with result data
  const handleCheckProbability = () => {
    if (!result) {
      alert("No result to analyze probability for");
      return;
    }

    // Prepare data for probability calculation
    const hybridData = {
      parentAId: parentA.id,
      parentBId: parentB.id,
    };

    // Navigate to Success Probability with hybrid data
    navigate("/breeding-planner/probability", { state: { hybridData } });
  };

  return (
    <div className="breeding-feature-container">
      <div className="feature-content hybrid-outcome-content">
        <div className="feature-header">
          <h1>Hybrid Outcome Estimator</h1>
          <p className="feature-subtitle">
            Predict potential characteristics of your hybrid plant based on
            parent genetics
          </p>
        </div>

        {error && (
          <div className="error-alert-modern">
            <span className="error-text">{error}</span>
          </div>
        )}

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
              onClick={handleEstimate}
              disabled={!parentA || !parentB}
            >
              Calculate Hybrid Outcome
            </button>
            {(parentA || parentB || result) && (
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="result-section-modern">
            <div className="result-header-gradient">
              <div className="result-title-section">
                <h2 className="result-main-title">Hybrid Result</h2>
                <p className="hybrid-formula">
                  {result.parentAName} <span className="formula-symbol">×</span>{" "}
                  {result.parentBName}
                </p>
                <div className="category-badge-large">{result.category}</div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="confidence-section">
              <div className="confidence-header">
                <h3>Prediction Confidence</h3>
                <div
                  className="confidence-level"
                  style={{ color: result.confidence.color }}
                >
                  {result.confidence.level}
                </div>
              </div>
              <div className="confidence-bar-container">
                <div
                  className="confidence-bar-fill"
                  style={{
                    width: `${result.confidence.score}%`,
                    background: `linear-gradient(90deg, ${result.confidence.color}, ${result.confidence.color}dd)`,
                  }}
                >
                  <span className="confidence-score">
                    {result.confidence.score}%
                  </span>
                </div>
              </div>
              <div className="confidence-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Traits Grid */}
            <div className="traits-section">
              <h3 className="section-title">Predicted Hybrid Traits</h3>
              <div className="traits-grid-modern">
                <div className="trait-card-modern height">
                  <div className="trait-content">
                    <h4>Height Range</h4>
                    <p className="trait-value">{result.height}</p>
                  </div>
                </div>

                <div className="trait-card-modern growth">
                  <div className="trait-content">
                    <h4>Growth Type</h4>
                    <p className="trait-value">{result.growthType}</p>
                  </div>
                </div>

                <div className="trait-card-modern water">
                  <div className="trait-content">
                    <h4>Water Needs</h4>
                    <p className="trait-value">{result.water}</p>
                  </div>
                </div>

                <div className="trait-card-modern sunlight">
                  <div className="trait-content">
                    <h4>Sunlight</h4>
                    <p className="trait-value">{result.sunlight}</p>
                  </div>
                </div>

                <div className="trait-card-modern climate">
                  <div className="trait-content">
                    <h4>Climate</h4>
                    <p className="trait-value">{result.climate}</p>
                  </div>
                </div>

                <div className="trait-card-modern soil">
                  <div className="trait-content">
                    <h4>Soil Type</h4>
                    <p className="trait-value">{result.soil}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Result Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "2rem",
                marginBottom: "1rem",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  transition: "all 0.3s ease",
                  opacity: saving || saveSuccess ? 0.7 : 1,
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                }}
              >
                {saving
                  ? "Saving..."
                  : saveSuccess
                  ? "✓ Saved!"
                  : "Save Result to Logbook"}
              </button>

              <button
                onClick={handleCheckProbability}
                style={{
                  background: "#9c27b0",
                  color: "white",
                  border: "none",
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(156, 39, 176, 0.3)",
                }}
              >
                Check Success Probability &rarr;
              </button>

              <button
                onClick={handleGetCareAdvisory}
                style={{
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "1rem 2.5rem",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(255, 152, 0, 0.3)",
                }}
              >
                Get Care Advisory &rarr;
              </button>

              {saveSuccess && (
                <button
                  onClick={() => navigate("/breeding-planner/logbook")}
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
                  View Logbook &rarr;
                </button>
              )}
            </div>

            {/* Info Note */}
            <div className="info-note-modern">
              <div className="note-content">
                <strong>Important Note:</strong> These predictions are based on
                genetic compatibility and parent plant characteristics. Actual
                results may vary based on growing conditions and environmental
                factors. Always monitor your hybrid plants closely and adjust
                care as needed.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HybridOutcome;
