import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { identifyInsect as apiIdentifyInsect } from "../utils/insectIdApi"; // Import the API function
import "./InsectIdentification.css";

const InsectIdentification = () => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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

  const identifyInsect = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the API utility function that's properly configured
      const data = await apiIdentifyInsect(selectedImage);
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Insect identification failed:", error);
      setError(`Failed to identify insect: ${error.message}`);
      setLoading(false);
    }
  };

  const resetIdentification = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  // Some sample insect data for information display
  const insectInfo = [
    {
      category: "Beneficial Insects",
      examples: ["Ladybugs", "Honeybees", "Butterflies", "Praying Mantis"],
      benefits:
        "Help pollinate plants, control pest populations, and maintain ecosystem balance.",
    },
    {
      category: "Garden Pests",
      examples: ["Aphids", "Caterpillars", "Whiteflies", "Spider Mites"],
      benefits:
        "Identification helps with targeted pest management strategies.",
    },
    {
      category: "Household Insects",
      examples: ["Ants", "Cockroaches", "Silverfish"],
      benefits: "Early identification can help prevent infestations.",
    },
  ];

  return (
    <div className="insect-identification-container">
      <div className="insect-identification-header">
        <h1>Insect Identification</h1>
        <p>Upload an image to identify insects in your garden or home</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!results ? (
        <div className="identification-area">
          <div
            className={`upload-area ${dragActive ? "drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
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
                <img src={previewUrl} alt="Insect preview" />
              </div>
            ) : (
              <div className="upload-prompt">
                <i className="fas fa-bug upload-icon"></i>
                <h3>Drag & Drop or Click to Upload</h3>
                <p>Upload a clear image of the insect you want to identify</p>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="action-buttons">
              <button
                className="secondary-button"
                onClick={resetIdentification}
              >
                Change Image
              </button>
              <button
                className="primary-button"
                onClick={identifyInsect}
                disabled={loading}
              >
                {loading ? "Identifying..." : "Identify Insect"}
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Analyzing your insect image...</p>
            </div>
          )}

          {/* Information about insects while waiting */}
          {!previewUrl && (
            <div className="insect-info-section">
              <h3>Why Identify Insects?</h3>
              <div className="insect-info-grid">
                {insectInfo.map((info, index) => (
                  <div key={index} className="insect-info-card">
                    <h4>{info.category}</h4>
                    <p className="examples">
                      Examples: {info.examples.join(", ")}
                    </p>
                    <p>{info.benefits}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="results-container">
          <div className="results-header">
            <h2>Identification Results</h2>
            <button className="secondary-button" onClick={resetIdentification}>
              Identify Another Insect
            </button>
          </div>

          <div className="results-content">
            <div className="identification-results">
              {results &&
              results.suggestions &&
              results.suggestions.length > 0 ? (
                <div className="suggestions">
                  <h3>Possible Matches:</h3>

                  {results.suggestions.map((suggestion, index) => {
                    // Extract data with fallbacks
                    const insectName = suggestion.name || "Unknown Insect";
                    const confidence = suggestion.probability
                      ? (suggestion.probability * 100).toFixed(1)
                      : "N/A";
                    const scientificName =
                      suggestion.taxonomy?.scientific_name || insectName;
                    const commonNames =
                      suggestion.common_names?.join(", ") || "Not available";
                    const family =
                      suggestion.taxonomy?.family || "Not available";
                    const description =
                      suggestion.description?.value ||
                      "No description available";
                    const hazardous =
                      suggestion.hazards?.length > 0
                        ? "Yes - " +
                          suggestion.hazards.map((h) => h.name).join(", ")
                        : "No known hazards";

                    return (
                      <div className="suggestion-card" key={index}>
                        <div className="suggestion-header">
                          <h4>{insectName}</h4>
                          <div className="confidence">{confidence}% Match</div>
                        </div>

                        <div className="insect-details">
                          <div className="name-section">
                            <p>
                              <strong>Common Names:</strong> {commonNames}
                            </p>
                            <p>
                              <strong>نام:</strong> {suggestion.name_urdu}
                            </p>
                          </div>

                          <div className="description-section">
                            <div className="english">
                              <p>
                                <strong>Description:</strong>
                              </p>
                              <p>{description}</p>
                            </div>
                            <div className="urdu">
                              <p>
                                <strong>تفصیل:</strong>
                              </p>
                              <p>{suggestion.description.urdu}</p>
                            </div>
                          </div>

                          <div className="treatment-section">
                            <h4>
                              Treatment & Control{" "}
                              {suggestion.cure_needed
                                ? "(Required)"
                                : "(Optional)"}
                            </h4>
                            <h4>
                              علاج و تدارک{" "}
                              {suggestion.cure_needed ? "(ضروری)" : "(اختیاری)"}
                            </h4>

                            <div className="english">
                              <p>{suggestion.treatment.value}</p>
                              <ul>
                                {suggestion.treatment.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="urdu">
                              <p>{suggestion.treatment.urdu}</p>
                              <ul>
                                {suggestion.treatment.steps_urdu.map(
                                  (step, i) => (
                                    <li key={i}>{step}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>

                          {suggestion.hazards &&
                            suggestion.hazards.length > 0 && (
                              <div className="hazards-section">
                                <p>
                                  <strong>Potentially Harmful:</strong>{" "}
                                  {hazardous}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-match">
                  <h3>No matches found</h3>
                  <p>
                    We couldn't identify this insect with confidence. Try
                    uploading a clearer image or a different angle.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="tips-section">
        <h3>Tips for Best Results</h3>
        <ul>
          <li>Use clear, close-up images of the insect</li>
          <li>
            Try to capture distinctive features like wings, antennae, or
            patterns
          </li>
          <li>Include size reference if possible (like a coin or ruler)</li>
          <li>Take photos from multiple angles if you can</li>
          <li>Ensure good lighting to show true colors</li>
        </ul>
      </div>

      <div className="safety-note">
        <h4>Safety Note</h4>
        <p>
          Never handle unknown insects, especially those with bright colors or
          unusual patterns, as they may sting or bite. Keep a safe distance when
          photographing.
        </p>
      </div>
    </div>
  );
};

export default InsectIdentification;
