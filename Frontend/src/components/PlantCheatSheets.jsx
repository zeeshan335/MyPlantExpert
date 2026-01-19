import React, { useState, useRef } from "react";
import {
  plantCheatSheets,
  cheatSheetCategories,
  searchCheatSheets,
} from "../data/plantCheatSheetsData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./PlantCheatSheets.css";

const PlantCheatSheets = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const cheatSheetRef = useRef(null);

  const getFilteredSheets = () => {
    let sheets = plantCheatSheets;

    if (selectedCategory !== "All") {
      sheets = sheets.filter((sheet) => sheet.category === selectedCategory);
    }

    if (searchTerm) {
      sheets = searchCheatSheets(searchTerm);
    }

    return sheets;
  };

  const filteredSheets = getFilteredSheets();

  const downloadPDF = async () => {
    if (!selectedSheet || !cheatSheetRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cheatSheetRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${selectedSheet.name.replace(/\s+/g, "_")}_CheatSheet.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="cheat-sheets-container">
      <div className="cheat-sheets-header">
        <button onClick={onBack} className="back-btn-cheat">
          ← Back to Knowledge Vault
        </button>
        <h1>🌿 Printable Plant Care Cheat Sheets</h1>
        <p>Quick reference guides for common plants - Download & Print</p>
      </div>

      {/* Search and Filter */}
      <div className="cheat-sheets-controls">
        <div className="search-bar-cheat">
          <input
            type="text"
            placeholder="Search plants... (e.g., Dhaniya, Mint, میتھی)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon-cheat">🔍</span>
        </div>

        <div className="category-filter-cheat">
          {cheatSheetCategories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn-cheat ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info-cheat">
        <p>
          Showing <strong>{filteredSheets.length}</strong> cheat sheet(s)
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Cheat Sheets Grid */}
      <div className="cheat-sheets-grid">
        {filteredSheets.length === 0 ? (
          <div className="no-results-cheat">
            <span className="no-results-icon-cheat">🔍</span>
            <h3>No cheat sheets found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          filteredSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="cheat-sheet-card"
              style={{ borderColor: sheet.color }}
              onClick={() => setSelectedSheet(sheet)}
            >
              <div
                className="cheat-card-header"
                style={{ background: sheet.color + "20" }}
              >
                <span className="cheat-icon" style={{ fontSize: "3rem" }}>
                  {sheet.image}
                </span>
              </div>
              <div className="cheat-card-body">
                <h3 style={{ color: sheet.color }}>{sheet.name}</h3>
                <p className="urdu-name">{sheet.urduName}</p>
                <span
                  className="category-badge-cheat"
                  style={{ background: sheet.color }}
                >
                  {sheet.category}
                </span>
                <button
                  className="view-btn-cheat"
                  style={{ background: sheet.color }}
                >
                  View & Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal with Printable View */}
      {selectedSheet && (
        <div
          className="modal-overlay-cheat"
          onClick={() => setSelectedSheet(null)}
        >
          <div
            className="modal-content-cheat"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-cheat">
              <h2>Plant Care Cheat Sheet</h2>
              <div className="modal-actions">
                <button
                  className="download-btn-cheat"
                  onClick={downloadPDF}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating PDF..." : "📥 Download PDF"}
                </button>
                <button
                  className="close-btn-cheat"
                  onClick={() => setSelectedSheet(null)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="modal-body-cheat">
              {/* Printable Cheat Sheet */}
              <div ref={cheatSheetRef} className="printable-cheat-sheet">
                {/* Header */}
                <div
                  className="print-header"
                  style={{ background: selectedSheet.color }}
                >
                  <div className="print-icon">{selectedSheet.image}</div>
                  <div className="print-title">
                    <h1>{selectedSheet.name}</h1>
                    <h2 className="urdu-title">{selectedSheet.urduName}</h2>
                  </div>
                  <div className="print-category">{selectedSheet.category}</div>
                </div>

                {/* Main Content */}
                <div className="print-content">
                  {/* Watering Schedule */}
                  <div className="print-section">
                    <div className="section-icon">💧</div>
                    <div className="section-content">
                      <h3>Watering Schedule</h3>
                      <p className="english-text">
                        {selectedSheet.wateringSchedule.english}
                      </p>
                      <p className="urdu-text">
                        {selectedSheet.wateringSchedule.urdu}
                      </p>
                    </div>
                  </div>

                  {/* Sunlight Needs */}
                  <div className="print-section">
                    <div className="section-icon">☀️</div>
                    <div className="section-content">
                      <h3>Sunlight Requirements</h3>
                      <p className="english-text">
                        {selectedSheet.sunlightNeeds.english}
                      </p>
                      <p className="urdu-text">
                        {selectedSheet.sunlightNeeds.urdu}
                      </p>
                    </div>
                  </div>

                  {/* Ideal Soil */}
                  <div className="print-section">
                    <div className="section-icon">🌱</div>
                    <div className="section-content">
                      <h3>Ideal Soil Conditions</h3>
                      <p className="english-text">
                        {selectedSheet.idealSoil.english}
                      </p>
                      <p className="urdu-text">
                        {selectedSheet.idealSoil.urdu}
                      </p>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="print-section">
                    <div className="section-icon">🌡️</div>
                    <div className="section-content">
                      <h3>Temperature Range</h3>
                      <p className="english-text">
                        {selectedSheet.temperature.english}
                      </p>
                      <p className="urdu-text">
                        {selectedSheet.temperature.urdu}
                      </p>
                    </div>
                  </div>

                  {/* Common Problems */}
                  <div className="print-section full-width">
                    <div className="section-icon">⚠️</div>
                    <div className="section-content">
                      <h3>Common Problems & Solutions</h3>
                      <ul className="problems-list">
                        {selectedSheet.commonProblems.map((problem, index) => (
                          <li key={index}>
                            <span className="english-text">
                              {problem.english}
                            </span>
                            <span className="urdu-text">{problem.urdu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Care Tips */}
                  <div className="print-section full-width">
                    <div className="section-icon">💡</div>
                    <div className="section-content">
                      <h3>Pro Tips</h3>
                      <ul className="tips-list">
                        {selectedSheet.careTips.map((tip, index) => (
                          <li key={index}>
                            <span className="english-text">{tip.english}</span>
                            <span className="urdu-text">{tip.urdu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Harvest Time */}
                  <div
                    className="print-section full-width harvest-section"
                    style={{ background: selectedSheet.color + "20" }}
                  >
                    <div className="section-icon">🌾</div>
                    <div className="section-content">
                      <h3>Harvest Time</h3>
                      <p className="english-text">
                        {selectedSheet.harvestTime.english}
                      </p>
                      <p className="urdu-text">
                        {selectedSheet.harvestTime.urdu}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="print-footer"
                  style={{ borderTop: `3px solid ${selectedSheet.color}` }}
                >
                  <p>MyPlantExpert - Your Complete Plant Care Guide</p>
                  <p>www.myplantexpert.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantCheatSheets;
