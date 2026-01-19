import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./PlantIdentification.css";

const PlantIdentification = () => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Update API endpoint to use your backend port 3001
  const apiUrl = "http://localhost:3001/api/plant/identify";

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

  const identifyPlant = async () => {
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
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Plant identification failed:", error);
      setError("Failed to identify plant. Please try again.");
      setLoading(false);
    }
  };

  const resetIdentification = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="plant-identification-container">
      <div className="plant-identification-header">
        <h1>Plant Identification</h1>
        <p>
          Upload an image to identify your plant and get detailed information
        </p>
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
                <img src={previewUrl} alt="Plant preview" />
              </div>
            ) : (
              <div className="upload-prompt">
                <i className="fas fa-leaf upload-icon"></i>
                <h3>Drag & Drop or Click to Upload</h3>
                <p>Upload a clear image of the plant you want to identify</p>
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
                onClick={identifyPlant}
                disabled={loading}
              >
                {loading ? "Identifying..." : "Identify Plant"}
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Analyzing your plant image...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="results-container">
          <div className="results-header">
            <h2>Identification Results</h2>
            <button className="secondary-button" onClick={resetIdentification}>
              Identify Another Plant
            </button>
          </div>

          <div
            className="results-content"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <div
              className="identification-results"
              style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}
            >
              {results.results && results.results.length > 0 ? (
                <div className="suggestions">
                  <h3>Possible Matches:</h3>

                  {results.results.map((result, index) => {
                    const species = result.species;
                    const score = result.score;
                    const plantName =
                      species.scientificNameWithoutAuthor ||
                      species.scientificName ||
                      "Unknown Plant";
                    const confidence = score ? (score * 100).toFixed(1) : "N/A";
                    const commonNames =
                      species.commonNames?.join(", ") || "Not available";
                    const family =
                      species.family?.scientificNameWithoutAuthor ||
                      species.family?.scientificName ||
                      "Not available";
                    const genus =
                      species.genus?.scientificNameWithoutAuthor ||
                      species.genus?.scientificName ||
                      "Not available";

                    return (
                      <div className="suggestion-card" key={index}>
                        <div className="suggestion-header">
                          <h4>{plantName}</h4>
                          <div className="confidence">{confidence}% Match</div>
                        </div>

                        <div className="plant-details">
                          <p>
                            <strong>Common Names:</strong> {commonNames}
                          </p>
                          <p>
                            <strong>Scientific Name:</strong> {plantName}
                          </p>
                          <p>
                            <strong>Family:</strong> {family}
                          </p>
                          <p>
                            <strong>Genus:</strong> {genus}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-match">
                  <h3>No matches found</h3>
                  <p>
                    We couldn't identify this plant with confidence. Try
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
          <li>Use clear, well-lit images</li>
          <li>Include the whole plant if possible</li>
          <li>Close-ups of leaves, flowers or fruits can help</li>
          <li>Avoid blurry or dark photos</li>
        </ul>
      </div>
    </div>
  );
};

export default PlantIdentification;
