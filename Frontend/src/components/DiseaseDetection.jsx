import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./DiseaseDetection.css";

// Pest to Disease mapping
const pestDiseaseMap = {
  "Aphis sp.": "Sooty Mold",
  Aphid: "Sooty Mold",
  Whitefly: "Leaf Curl",
  Thrips: "Leaf Spot Disease",
  "Spider Mite": "Leaf Spot Disease",
  Mealybug: "Sooty Mold",
  Scale: "Sooty Mold",
  Caterpillar: "Blight",
  "Leaf Miner": "Leaf Spot Disease",
};

// Plant disease treatments database
const plantDiseaseTreatments = [
  {
    disease: "Powdery Mildew",
    treatment:
      "Remove infected leaves, improve air circulation, apply organic fungicides like neem oil or baking soda solution (1 tsp baking soda + 1 quart water).",
  },
  {
    disease: "Downy Mildew",
    treatment:
      "Remove and destroy infected foliage, avoid evening watering, plant resistant cultivars, improve spacing for air circulation.",
  },
  {
    disease: "Black Spot",
    treatment:
      "Remove affected leaves, avoid overhead watering, apply sulfur-based or copper-based fungicides.",
  },
  {
    disease: "Mosaic Virus",
    treatment:
      "Remove infected plants, control insect vectors, use virus-resistant varieties.",
  },
  {
    disease: "Damping-Off Disease",
    treatment:
      "Use sterile soil, avoid overwatering, ensure good drainage, apply fungicides if necessary.",
  },
  {
    disease: "Fusarium Wilt",
    treatment:
      "Remove and destroy infected plants, rotate crops, use resistant varieties.",
  },
  {
    disease: "Verticillium Wilt",
    treatment: "Remove infected plants, rotate crops, use resistant cultivars.",
  },
  {
    disease: "Leaf Spot Disease",
    treatment:
      "Remove and dispose of infected leaves, avoid overhead watering, use copper-based fungicide.",
  },
  {
    disease: "Rust Disease",
    treatment:
      "Remove and destroy affected leaves, apply sulfur-based fungicide, improve airflow.",
  },
  {
    disease: "Botrytis (Gray Mold)",
    treatment:
      "Prune affected areas, remove dead material, improve air circulation, apply copper spray.",
  },
  {
    disease: "Root Rot",
    treatment:
      "Remove plant, trim rotted roots, repot in well-draining soil, water only when topsoil is dry.",
  },
  {
    disease: "Anthracnose",
    treatment:
      "Prune infected branches, destroy fallen leaves, avoid overhead watering, use fungicides with chlorothalonil.",
  },
  {
    disease: "Clubroot",
    treatment: "Remove infected plants, lime soil to raise pH, rotate crops.",
  },
  {
    disease: "White Mold",
    treatment:
      "Remove infected plant parts, improve air circulation, apply fungicides.",
  },
  {
    disease: "Bacterial Soft Rot",
    treatment:
      "Remove and destroy infected plants, improve drainage, avoid wounding plants.",
  },
  {
    disease: "Bacterial Leaf Spot",
    treatment:
      "Remove infected leaves, avoid overhead watering, use copper-based bactericide.",
  },
  {
    disease: "Sooty Mold",
    treatment:
      "Control insect pests (aphids, whiteflies), wash off mold, improve air circulation.",
  },
  {
    disease: "Blight",
    treatment:
      "Remove and destroy infected plant parts, use resistant varieties, apply fungicides.",
  },
  {
    disease: "Scab",
    treatment:
      "Remove infected fruit/leaves, apply fungicides, use resistant varieties.",
  },
  {
    disease: "Canker",
    treatment:
      "Prune and destroy infected branches, disinfect tools, apply fungicides.",
  },
  {
    disease: "Wilt",
    treatment: "Remove infected plants, rotate crops, use resistant varieties.",
  },
  {
    disease: "Crown Rot",
    treatment: "Remove infected plants, improve drainage, avoid overwatering.",
  },
  {
    disease: "Smut",
    treatment:
      "Remove and destroy infected plants, rotate crops, use resistant varieties.",
  },
  {
    disease: "Mildew",
    treatment: "Remove infected parts, improve air flow, apply fungicides.",
  },
  {
    disease: "Phytophthora Root Rot",
    treatment:
      "Improve drainage, remove infected plants, use resistant varieties.",
  },
  {
    disease: "Bacterial Wilt",
    treatment: "Remove infected plants, control insect vectors, rotate crops.",
  },
  {
    disease: "Septoria Leaf Spot",
    treatment: "Remove infected leaves, apply fungicides, rotate crops.",
  },
  {
    disease: "Fire Blight",
    treatment:
      "Prune infected branches, disinfect tools, apply copper-based bactericide.",
  },
  {
    disease: "Alternaria Leaf Spot",
    treatment: "Remove infected leaves, apply fungicides, rotate crops.",
  },
  {
    disease: "Leaf Curl",
    treatment:
      "Remove infected leaves, apply fungicides, use resistant varieties.",
  },
  // ... more diseases would be here in a real implementation
];

const DiseaseDetection = () => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Update API endpoint to use backend
  const apiUrl = "http://localhost:3001/api/disease/detect";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setError(null);
    } else if (file) {
      setError("Please select a valid image file.");
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const detectDisease = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for backend API
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Log the full API response to the console
      console.log("Disease Detection API Response:", data);

      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Disease detection failed:", error);
      setError("Failed to analyze plant health. Please try again.");
      setLoading(false);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  // Function to find matching treatment for a disease
  const findTreatment = (diseaseName) => {
    if (!diseaseName) return null;

    const lowerDiseaseName = diseaseName.toLowerCase();

    // Try to find exact matches first
    const exactMatch = plantDiseaseTreatments.find(
      (item) => item.disease.toLowerCase() === lowerDiseaseName
    );

    if (exactMatch) return exactMatch.treatment;

    // Try to find partial matches
    for (const item of plantDiseaseTreatments) {
      if (
        lowerDiseaseName.includes(item.disease.toLowerCase()) ||
        item.disease.toLowerCase().includes(lowerDiseaseName)
      ) {
        return item.treatment;
      }
    }

    // General treatment if no match found
    return "Remove infected plant parts, improve growing conditions including air circulation, avoid overhead watering, apply appropriate fungicides or bactericides based on the type of disease.";
  };

  return (
    <div className="disease-detection-container">
      <div className="disease-detection-header">
        <h1>Plant Health & Pest Detection</h1>
        <p>
          Upload an image to identify potential pests, diseases and health
          issues in your plants
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!results ? (
        <div
          className="detection-area"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className={`upload-area ${dragActive ? "drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {previewUrl ? (
              <div className="image-preview">
                <img src={previewUrl} alt="Plant preview" />
              </div>
            ) : (
              <div className="upload-prompt">
                <i className="fas fa-leaf upload-icon"></i>
                <h3>Drag & Drop or Click to Upload</h3>
                <p>
                  Upload a clear image of the plant you want to check for
                  diseases
                </p>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="action-buttons">
              <button
                className="secondary-button"
                onClick={resetDetection}
                style={{ padding: "8px 16px", fontSize: "0.9rem" }}
              >
                Change Image
              </button>
              <button
                className="primary-button"
                onClick={detectDisease}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Detect Disease"}
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Analyzing your plant's health condition...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="results-container">
          <div className="results-header">
            <h2>Health & Pest Detection Results</h2>
            <button className="secondary-button" onClick={resetDetection}>
              Analyze Another Plant
            </button>
          </div>

          <div
            className="results-content"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <div
              className="health-assessment-results"
              style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}
            >
              {results.results && results.results.length > 0 ? (
                <div className="diseases-list">
                  <h3>Detected Issues:</h3>

                  {results.results.map((result, index) => {
                    // Parse PlantNet API response correctly
                    const issueName =
                      result.description || result.name || "Unknown Issue";
                    const confidence = result.score
                      ? (result.score * 100).toFixed(1)
                      : "N/A";

                    // Map pest to related disease
                    const mappedDisease =
                      pestDiseaseMap[issueName] || issueName;

                    // Get treatment from our database
                    const treatmentInfo = findTreatment(mappedDisease);

                    return (
                      <div className="disease-card" key={index}>
                        <div className="disease-header">
                          <h4>Detected Issue: {issueName}</h4>
                          <div className="confidence">
                            {confidence}% Confidence
                          </div>
                        </div>

                        <div className="disease-details">
                          <p>
                            <strong>Issue Code:</strong> {result.name || "N/A"}
                          </p>
                          {mappedDisease !== issueName && (
                            <p>
                              <strong>Related Disease:</strong> {mappedDisease}
                            </p>
                          )}

                          <div
                            className="treatment"
                            style={{
                              backgroundColor: "#fff3e0",
                              padding: "15px",
                              borderRadius: "8px",
                              marginTop: "15px",
                              border: "1px solid #ffb74d",
                            }}
                          >
                            <p style={{ margin: 0 }}>
                              <strong>Treatment & Prevention:</strong>{" "}
                              {treatmentInfo}
                            </p>
                          </div>

                          <p
                            className="disclaimer"
                            style={{
                              fontSize: "0.85rem",
                              fontStyle: "italic",
                              marginTop: "15px",
                              color: "#666",
                            }}
                          >
                            Note: Always verify treatments before application.
                            For serious plant health issues, consult with a
                            professional horticulturist or plant pathologist.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-diseases">
                  <h3>No issues detected</h3>
                  <p>
                    Your plant appears to be healthy, or the image quality may
                    not be sufficient for detection.
                  </p>
                  <p>
                    Try uploading a clearer image focusing on any affected
                    areas, pests, or symptoms.
                  </p>
                </div>
              )}

              {/* Additional advice section */}
              <div className="health-advice">
                <h4>General Plant Health Tips:</h4>
                <ul>
                  <li>Ensure proper watering - not too much, not too little</li>
                  <li>
                    Provide adequate light according to your plant's needs
                  </li>
                  <li>Check regularly for pests on the underside of leaves</li>
                  <li>Keep leaves clean and dust-free</li>
                  <li>Ensure good air circulation around your plants</li>
                  <li>Isolate infected plants to prevent spread</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tips-section">
        <h3>Tips for Best Detection Results</h3>
        <ul>
          <li>Focus on the affected areas (leaves, stems, pests)</li>
          <li>
            Take close-ups of spots, discoloration, pests or unusual growth
          </li>
          <li>Include both healthy and unhealthy parts for comparison</li>
          <li>Use good lighting to show true colors and details</li>
          <li>Capture any visible insects or pest damage clearly</li>
        </ul>
      </div>
    </div>
  );
};

export default DiseaseDetection;
