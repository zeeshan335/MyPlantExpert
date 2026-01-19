import React from "react";

const StepByStepGuides = ({
  selectedGuide,
  plantGuides,
  onSelectGuide,
  onBackToGuides,
  onBackToMain,
}) => {
  if (selectedGuide) {
    return (
      <div className="guide-detail">
        <div className="guide-detail-header">
          <button className="back-to-guides-btn" onClick={onBackToGuides}>
            ← Back to Guides
          </button>
          <div className="guide-title-section">
            <div
              className="guide-icon-large"
              style={{ color: selectedGuide.color }}
            >
              {selectedGuide.icon}
            </div>
            <div>
              <h1>{selectedGuide.title}</h1>
              <div className="guide-info-row">
                <span className="info-badge">📂 {selectedGuide.category}</span>
                <span
                  className="info-badge"
                  style={{ background: selectedGuide.color }}
                >
                  {selectedGuide.difficulty}
                </span>
                <span className="info-badge">⏱️ {selectedGuide.time}</span>
                <span className="info-badge">
                  📝 {selectedGuide.steps.length} Steps
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="steps-container">
          {selectedGuide.steps.map((step, index) => (
            <div
              key={index}
              className="step-card"
              style={{ borderLeftColor: selectedGuide.color }}
            >
              <div
                className="step-number"
                style={{ background: selectedGuide.color }}
              >
                {step.step}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <div className="step-tip">
                  <span className="tip-icon">💡</span>
                  <span className="tip-text">{step.tip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="guide-completion">
          <div
            className="completion-card"
            style={{ borderColor: selectedGuide.color }}
          >
            <h3>🎉 Great Job!</h3>
            <p>You've completed all steps for {selectedGuide.title}</p>
            <button
              className="back-to-guides-btn"
              onClick={onBackToGuides}
              style={{ background: selectedGuide.color }}
            >
              View More Guides
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-section">
      <button className="back-to-categories-btn" onClick={onBackToMain}>
        ← Back to Main Menu
      </button>

      <div className="guides-header">
        <h2>📋 Step-by-Step Plant Guides</h2>
        <p>Follow simple, actionable instructions for successful plant care</p>
      </div>

      <div className="guides-grid">
        {plantGuides.map((guide) => (
          <div
            key={guide.id}
            className="guide-card"
            onClick={() => onSelectGuide(guide)}
            style={{ borderColor: guide.color }}
          >
            <div className="guide-header">
              <div className="guide-icon" style={{ color: guide.color }}>
                {guide.icon}
              </div>
              <div className="guide-badges">
                <span
                  className="difficulty-badge"
                  style={{ background: guide.color }}
                >
                  {guide.difficulty}
                </span>
              </div>
            </div>
            <h3>{guide.title}</h3>
            <div className="guide-meta">
              <span>⏱️ {guide.time}</span>
              <span>📑 {guide.steps.length} Steps</span>
            </div>
            <p className="guide-category">{guide.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepByStepGuides;
