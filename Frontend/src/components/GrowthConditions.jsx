import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  saveCareAdvisory,
  getCareAdvisories,
  deleteCareAdvisory,
} from "../firebase/careAdvisoryService";
import "./BreedingFeature.css";

const GrowthConditions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [hybridData, setHybridData] = useState(null);
  const [savedAdvisories, setSavedAdvisories] = useState([]);
  const [showSavedAdvisories, setShowSavedAdvisories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Check if hybrid data was passed from HybridOutcome
    if (location.state?.hybridData) {
      setHybridData(location.state.hybridData);
      setShowSavedAdvisories(false);
    }

    // Load saved advisories
    loadSavedAdvisories();
  }, [location.state, currentUser]);

  const loadSavedAdvisories = async () => {
    if (!currentUser) return;

    try {
      const advisories = await getCareAdvisories(currentUser.email);
      setSavedAdvisories(advisories);
    } catch (error) {
      console.error("Error loading advisories:", error);
    }
  };

  const handleSaveAdvisory = async () => {
    if (!currentUser) {
      alert("Please login to save care advisories");
      navigate("/login");
      return;
    }

    if (!hybridData) {
      alert("No advisory to save");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await saveCareAdvisory(currentUser.email, hybridData);

      if (response.success) {
        setSaveSuccess(true);
        await loadSavedAdvisories();
        alert("✅ Care advisory saved successfully!");
      } else {
        alert("Failed to save advisory. Please try again.");
      }
    } catch (error) {
      console.error("Error saving advisory:", error);
      alert("An error occurred while saving the advisory.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdvisory = async (advisoryId) => {
    if (!window.confirm("Are you sure you want to delete this advisory?")) {
      return;
    }

    const response = await deleteCareAdvisory(advisoryId);
    if (response.success) {
      await loadSavedAdvisories();
      alert("Advisory deleted successfully!");
    } else {
      alert("Failed to delete advisory. Please try again.");
    }
  };

  const viewAdvisory = (advisory) => {
    setHybridData(advisory);
    setShowSavedAdvisories(false);
    setSaveSuccess(false);
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

  return (
    <div className="breeding-feature-container">
      <button
        className="back-btn"
        onClick={() => navigate("/breeding-planner")}
      >
        Back to Planner
      </button>

      <div className="feature-content">
        <div className="feature-header">
          <h1>Growth Condition Advisor</h1>
          <p className="feature-subtitle">
            Get optimal environmental conditions for your hybrid plants
          </p>
        </div>

        {savedAdvisories.length > 0 && (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <button
              onClick={() => setShowSavedAdvisories(!showSavedAdvisories)}
              style={{
                background: "#2196f3",
                color: "white",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              {showSavedAdvisories
                ? "Hide Saved Advisories"
                : `View Saved Advisories (${savedAdvisories.length})`}
            </button>
          </div>
        )}

        {showSavedAdvisories ? (
          <div className="saved-advisories-section">
            <h2 style={{ color: "#0f2d1a", marginBottom: "1.5rem" }}>
              Your Saved Care Advisories
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {savedAdvisories.map((advisory) => (
                <div
                  key={advisory.id}
                  style={{
                    background: "white",
                    border: "2px solid #e8e8e8",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3
                    style={{
                      color: "#0f2d1a",
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.2rem",
                    }}
                  >
                    {advisory.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
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
                      {advisory.category}
                    </span>
                    <span
                      style={{
                        background:
                          advisory.confidenceLevel === "High"
                            ? "#e8f5e9"
                            : advisory.confidenceLevel === "Medium"
                            ? "#fff3e0"
                            : "#ffebee",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        color:
                          advisory.confidenceLevel === "High"
                            ? "#2e7d32"
                            : advisory.confidenceLevel === "Medium"
                            ? "#e65100"
                            : "#c62828",
                        fontWeight: "600",
                      }}
                    >
                      {advisory.confidenceLevel}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Saved: {formatDate(advisory.createdAt)}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => viewAdvisory(advisory)}
                      style={{
                        flex: 1,
                        background: "#4caf50",
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
                      onClick={() => handleDeleteAdvisory(advisory.id)}
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
          </div>
        ) : hybridData ? (
          <div className="result-section-modern">
            <div className="result-header-gradient">
              <div className="result-title-section">
                <h2 className="result-main-title">Care Advisory</h2>
                <p className="hybrid-formula">
                  {hybridData.parentAName}{" "}
                  <span className="formula-symbol">×</span>{" "}
                  {hybridData.parentBName}
                </p>
                <div className="category-badge-large">
                  {hybridData.category}
                </div>
              </div>
            </div>

            <div className="traits-section">
              <h3 className="section-title">Optimal Growing Conditions</h3>
              <div className="traits-grid-modern">
                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Sunlight Requirements</h4>
                    <p className="trait-value">{hybridData.sunlight}</p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      {hybridData.sunlight === "Full Sun" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Duration:</strong> 6-8 hours of direct
                            sunlight daily
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Best Location:</strong> South-facing windows
                            or outdoor areas with no shade
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Signs of Insufficient Light:</strong> Leggy
                            growth, pale leaves, reduced flowering
                          </p>
                          <p>
                            <strong>Tips:</strong> Rotate plant weekly for even
                            growth. Consider supplemental grow lights in winter.
                          </p>
                        </>
                      )}
                      {hybridData.sunlight === "Partial Shade" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Duration:</strong> 3-6 hours of indirect or
                            filtered sunlight
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Best Location:</strong> East or west-facing
                            windows, areas with morning sun
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Signs of Too Much Light:</strong> Scorched
                            leaves, wilting in afternoon
                          </p>
                          <p>
                            <strong>Tips:</strong> Use sheer curtains to filter
                            intense afternoon sun. Avoid hot, south-facing
                            exposure.
                          </p>
                        </>
                      )}
                      {hybridData.sunlight === "Partial to Full Sun" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Duration:</strong> 4-8 hours of sunlight
                            (flexible)
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Best Location:</strong> Adaptable to various
                            conditions, east/west/south facing
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Advantage:</strong> Versatile plant that
                            adjusts to different light levels
                          </p>
                          <p>
                            <strong>Tips:</strong> Monitor plant response and
                            adjust placement accordingly. More sun = more
                            flowers/fruits.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Watering Schedule</h4>
                    <p className="trait-value">{hybridData.water}</p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      {hybridData.water === "Regular" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Frequency:</strong> 2-3 times per week,
                            adjust based on season
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Method:</strong> Water until it drains from
                            bottom, empty saucer after 30 minutes
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Soil Moisture:</strong> Keep consistently
                            moist but not waterlogged
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Seasonal Adjustments:</strong> More in
                            summer/hot weather, less in winter
                          </p>
                          <p>
                            <strong>Warning Signs:</strong> Drooping leaves
                            (underwatered), yellow leaves (overwatered)
                          </p>
                        </>
                      )}
                      {hybridData.water === "Moderate" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Frequency:</strong> Once a week, check soil
                            before watering
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Method:</strong> Water deeply, allow top 2-3
                            inches to dry between waterings
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Soil Test:</strong> Insert finger 2 inches
                            deep - if dry, water; if moist, wait
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Seasonal Adjustments:</strong> Reduce to
                            every 10-14 days in winter
                          </p>
                          <p>
                            <strong>Best Practice:</strong> Better to underwater
                            than overwater - roots need oxygen
                          </p>
                        </>
                      )}
                      {hybridData.water === "Low" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Frequency:</strong> Once every 10-14 days,
                            even less in winter
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Method:</strong> Water deeply but
                            infrequently, let soil dry completely
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Drought Tolerant:</strong> Can survive
                            periods of neglect without harm
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Winter Care:</strong> Reduce to once per
                            month or when soil is completely dry
                          </p>
                          <p>
                            <strong>Critical:</strong> Ensure excellent drainage
                            to prevent root rot from overwatering
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Climate Preference</h4>
                    <p className="trait-value">{hybridData.climate}</p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Optimal Temperature Range:</strong>{" "}
                        {hybridData.climate.includes("Tropical") &&
                          "65-85°F (18-29°C)"}
                        {hybridData.climate.includes("Temperate") &&
                          "55-75°F (13-24°C)"}
                        {hybridData.climate.includes("Cool") &&
                          "45-65°F (7-18°C)"}
                        {hybridData.climate.includes("Warm") &&
                          "70-85°F (21-29°C)"}
                        {hybridData.climate.includes("Subtropical") &&
                          "60-80°F (16-27°C)"}
                        {!hybridData.climate.includes("Tropical") &&
                          !hybridData.climate.includes("Temperate") &&
                          !hybridData.climate.includes("Cool") &&
                          !hybridData.climate.includes("Warm") &&
                          !hybridData.climate.includes("Subtropical") &&
                          "60-75°F (16-24°C)"}
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Humidity Requirements:</strong>{" "}
                        {hybridData.climate.includes("Tropical") &&
                          "High (60-80%) - Use humidifier or pebble tray"}
                        {hybridData.climate.includes("Temperate") &&
                          "Moderate (40-60%) - Average indoor humidity"}
                        {hybridData.climate.includes("Cool") &&
                          "Moderate to Low (30-50%)"}
                        {hybridData.climate.includes("Warm") &&
                          "Moderate to High (50-70%)"}
                        {hybridData.climate.includes("Subtropical") &&
                          "Moderate (50-70%)"}
                        {!hybridData.climate.includes("Tropical") &&
                          !hybridData.climate.includes("Temperate") &&
                          !hybridData.climate.includes("Cool") &&
                          !hybridData.climate.includes("Warm") &&
                          !hybridData.climate.includes("Subtropical") &&
                          "Moderate (40-60%)"}
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Frost Tolerance:</strong>{" "}
                        {hybridData.climate.includes("Tropical") &&
                          "None - Bring indoors below 50°F"}
                        {hybridData.climate.includes("Temperate") &&
                          "Some varieties tolerate light frost"}
                        {hybridData.climate.includes("Cool") &&
                          "Good frost tolerance, hardy in cold weather"}
                        {hybridData.climate.includes("Warm") &&
                          "Low - Protect from temperatures below 45°F"}
                        {hybridData.climate.includes("Subtropical") &&
                          "Moderate - Can tolerate brief cold snaps"}
                        {!hybridData.climate.includes("Tropical") &&
                          !hybridData.climate.includes("Temperate") &&
                          !hybridData.climate.includes("Cool") &&
                          !hybridData.climate.includes("Warm") &&
                          !hybridData.climate.includes("Subtropical") &&
                          "Varies - check specific requirements"}
                      </p>
                      <p>
                        <strong>Seasonal Care:</strong> Adjust watering and
                        fertilizing based on temperature. Indoor plants may need
                        supplemental lighting in winter.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Soil Requirements</h4>
                    <p className="trait-value">{hybridData.soil}</p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Soil Type:</strong> {hybridData.soil} -
                        Essential for optimal growth
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Drainage:</strong> Must have excellent drainage
                        to prevent root rot and fungal issues
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>pH Level:</strong>{" "}
                        {hybridData.soil.includes("Loamy") &&
                          "6.0-7.0 (Slightly acidic to neutral)"}
                        {hybridData.soil.includes("Sandy") &&
                          "6.0-7.5 (Neutral to slightly alkaline)"}
                        {hybridData.soil.includes("Clay") &&
                          "6.5-7.5 (Neutral)"}
                        {hybridData.soil.includes("Acidic") &&
                          "4.5-6.0 (Acidic) - Use peat moss or sulfur"}
                        {!hybridData.soil.includes("Loamy") &&
                          !hybridData.soil.includes("Sandy") &&
                          !hybridData.soil.includes("Clay") &&
                          !hybridData.soil.includes("Acidic") &&
                          "6.0-7.0 (Neutral)"}
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Amendments:</strong> Add organic compost,
                        perlite, or vermiculite for better structure
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Fertilization:</strong> Use balanced fertilizer
                        (10-10-10) during growing season
                      </p>
                      <p>
                        <strong>Repotting:</strong> Every 1-2 years in spring,
                        increase pot size by 2 inches
                      </p>
                    </div>
                  </div>
                </div>

                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Expected Height</h4>
                    <p className="trait-value">{hybridData.heightRange}</p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Mature Size:</strong> Plan container or garden
                        space accordingly
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Growth Rate:</strong> Varies based on conditions
                        - optimal care accelerates growth
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Spacing Guidelines:</strong> Allow 1.5x the
                        mature width between plants
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Support Needed:</strong>{" "}
                        {hybridData.growthType === "Vine" &&
                          "Yes - Stakes, trellis, or cage required"}
                        {hybridData.growthType === "Tree" &&
                          "May need staking when young"}
                        {hybridData.growthType === "Bush" &&
                          "Generally self-supporting"}
                        {hybridData.growthType === "Herbaceous" &&
                          "Minimal support needed"}
                        {!["Vine", "Tree", "Bush", "Herbaceous"].includes(
                          hybridData.growthType
                        ) && "Check growth type for specific needs"}
                      </p>
                      <p>
                        <strong>Pruning:</strong> Regular pruning helps control
                        size and promotes bushier growth
                      </p>
                    </div>
                  </div>
                </div>

                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Growth Type & Care</h4>
                    <p className="trait-value">{hybridData.growthType}</p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      {hybridData.growthType === "Vine" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Support Structure:</strong> Install trellis,
                            stake, or cage before planting
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Training:</strong> Gently tie stems to
                            support as they grow, avoid damaging stems
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Pruning:</strong> Remove dead/damaged vines,
                            trim to control spread
                          </p>
                          <p>
                            <strong>Tip:</strong> Direct growth upward or
                            horizontally based on desired shape
                          </p>
                        </>
                      )}
                      {hybridData.growthType === "Bush" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Pruning:</strong> Shape in early spring,
                            remove dead/crossing branches
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Maintenance:</strong> Pinch back tips to
                            encourage bushier, compact growth
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Air Circulation:</strong> Thin interior
                            branches to prevent fungal issues
                          </p>
                          <p>
                            <strong>Flowering:</strong> Deadhead spent blooms to
                            encourage continuous flowering
                          </p>
                        </>
                      )}
                      {hybridData.growthType === "Tree" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Space Requirements:</strong> Needs ample
                            room for root and canopy development
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Initial Care:</strong> Stake young trees for
                            first 1-2 years until established
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Pruning:</strong> Shape in dormant season,
                            remove competing central leaders
                          </p>
                          <p>
                            <strong>Long-term:</strong> Mature trees require
                            minimal maintenance but annual inspection
                          </p>
                        </>
                      )}
                      {hybridData.growthType === "Herbaceous" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Seasonal Nature:</strong> Dies back in
                            winter, regrows from roots in spring
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Winter Care:</strong> Mulch roots in cold
                            climates for protection
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Division:</strong> Divide every 3-4 years in
                            spring for vigorous growth
                          </p>
                          <p>
                            <strong>Maintenance:</strong> Cut back dead foliage
                            in fall or early spring
                          </p>
                        </>
                      )}
                      {hybridData.growthType === "Root" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Planting Depth:</strong> Follow specific
                            depth requirements for each variety
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Soil Preparation:</strong> Loose, rock-free
                            soil essential for straight root development
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Harvesting:</strong> Carefully dig around
                            roots to avoid damage, harvest when mature
                          </p>
                          <p>
                            <strong>Storage:</strong> Remove tops, store in
                            cool, dark, humid conditions
                          </p>
                        </>
                      )}
                      {hybridData.growthType === "Leafy" && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Harvesting:</strong> Pick outer leaves
                            first, allow center to continue growing
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Succession Planting:</strong> Plant new
                            crops every 2-3 weeks for continuous harvest
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Pest Control:</strong> Inspect regularly for
                            aphids and caterpillars
                          </p>
                          <p>
                            <strong>Bolt Prevention:</strong> Provide shade in
                            hot weather to extend harvest season
                          </p>
                        </>
                      )}
                      {![
                        "Vine",
                        "Bush",
                        "Tree",
                        "Herbaceous",
                        "Root",
                        "Leafy",
                      ].includes(hybridData.growthType) && (
                        <>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>General Care:</strong> Follow specific
                            requirements for your growth type
                          </p>
                          <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Maintenance:</strong> Regular monitoring and
                            adjustment of care routine
                          </p>
                          <p>
                            <strong>Research:</strong> Consult specialized
                            resources for detailed care instructions
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="trait-card-modern">
                  <div className="trait-content">
                    <h4>Breeding Success Confidence</h4>
                    <p className="trait-value">
                      {hybridData.confidenceLevel} ({hybridData.confidenceScore}
                      %)
                    </p>
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Compatibility Score:</strong> Based on genetic
                        similarity and environmental needs
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Success Factors:</strong>{" "}
                        {hybridData.confidenceLevel === "High" &&
                          "Excellent genetic compatibility, similar requirements"}
                        {hybridData.confidenceLevel === "Medium" &&
                          "Moderate compatibility, some adaptations needed"}
                        {hybridData.confidenceLevel === "Low" &&
                          "Limited compatibility, expert care required"}
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Expected Outcome:</strong>{" "}
                        {hybridData.confidenceLevel === "High" &&
                          "80-95% success rate with proper care"}
                        {hybridData.confidenceLevel === "Medium" &&
                          "50-79% success rate, monitor closely"}
                        {hybridData.confidenceLevel === "Low" &&
                          "Below 50% success rate, advanced techniques needed"}
                      </p>
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Key Considerations:</strong> Pollination timing,
                        pollen viability, environmental conditions
                      </p>
                      <p>
                        <strong>Pro Tip:</strong> Keep detailed records of
                        attempts, conditions, and outcomes for future reference
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-note-modern">
              <div className="note-content">
                <strong>Important Care Advisory:</strong> These recommendations
                are based on parent plant characteristics and typical hybrid
                outcomes. Individual plants may show variation in their
                requirements and growth patterns. Monitor your hybrid closely
                during the first few weeks after planting or germination. Adjust
                watering frequency based on soil moisture, not a fixed schedule.
                Temperature extremes can stress plants - protect from frost and
                excessive heat. Signs of stress include wilting, leaf
                discoloration, or stunted growth. Early detection and adjustment
                of care conditions significantly improves success rates.
                Consider starting seeds indoors in controlled conditions before
                transplanting outdoors. Keep a garden journal to track progress
                and identify successful techniques for future breeding projects.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              <button
                onClick={handleSaveAdvisory}
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
                  : "Save Advisory"}
              </button>

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
                ← Back to Outcome
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "#f9f9f9",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>
              No Advisory Data
            </h3>
            <p style={{ color: "#999", marginBottom: "1.5rem" }}>
              Generate a hybrid outcome first to get care advisory
            </p>
            <button
              onClick={() => navigate("/breeding-planner/outcome")}
              style={{
                background: "#4caf50",
                color: "white",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Go to Hybrid Outcome
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthConditions;
