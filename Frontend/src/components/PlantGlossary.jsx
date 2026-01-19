import React, { useState } from "react";
import {
  plantGlossary,
  glossaryCategories,
  searchGlossary,
  filterByCategory,
} from "../data/plantGlossaryData";
import "./PlantGlossary.css";

const PlantGlossary = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Terms");
  const [selectedLetter, setSelectedLetter] = useState("All");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getFilteredTerms = () => {
    let terms = plantGlossary;

    // Filter by category
    if (selectedCategory !== "All Terms") {
      terms = filterByCategory(selectedCategory);
    }

    // Filter by search (search in both English and Urdu)
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      terms = terms.filter(
        (item) =>
          item.term.toLowerCase().includes(term) ||
          item.definition.toLowerCase().includes(term) ||
          item.urduTerm.includes(term) ||
          item.urduDefinition.includes(term)
      );
    }

    // Filter by letter
    if (selectedLetter !== "All") {
      terms = terms.filter(
        (item) => item.term.charAt(0).toUpperCase() === selectedLetter
      );
    }

    return terms;
  };

  const filteredTerms = getFilteredTerms();

  return (
    <div className="plant-glossary-container">
      <div className="glossary-header">
        <button onClick={onBack} className="back-btn-glossary">
          ← Back to Knowledge Vault
        </button>
        <h1>🌿 Plant Glossary</h1>
        <p>Learn gardening terminology in English and Urdu</p>
      </div>

      {/* Search Bar */}
      <div className="glossary-search">
        <input
          type="text"
          placeholder="Search terms in English or Urdu... (e.g., pruning, pH, کھاد)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Category Filter */}
      <div className="category-filter-glossary">
        {glossaryCategories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn-glossary ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alphabet Filter */}
      <div className="alphabet-filter">
        <button
          className={`letter-btn ${selectedLetter === "All" ? "active" : ""}`}
          onClick={() => setSelectedLetter("All")}
        >
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`letter-btn ${
              selectedLetter === letter ? "active" : ""
            }`}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Showing <strong>{filteredTerms.length}</strong> terms
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Glossary Terms - Card Grid */}
      <div className="glossary-cards-grid">
        {filteredTerms.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No terms found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          filteredTerms.map((item) => (
            <div key={item.id} className="glossary-card">
              <div className="card-header">
                <span className="term-category-badge">{item.category}</span>
              </div>

              <div className="card-body">
                {/* English Section */}
                <div className="language-section english-section">
                  <div className="term-title-row">
                    <span className="language-label">🇬🇧 English</span>
                  </div>
                  <h3 className="term-name">{item.term}</h3>
                  <p className="term-definition">{item.definition}</p>
                </div>

                {/* Divider */}
                <div className="language-divider"></div>

                {/* Urdu Section */}
                <div className="language-section urdu-section">
                  <div className="term-title-row">
                    <span className="language-label">🇵🇰 اردو</span>
                  </div>
                  <h3 className="term-name urdu-text">{item.urduTerm}</h3>
                  <p className="term-definition urdu-text">
                    {item.urduDefinition}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlantGlossary;
