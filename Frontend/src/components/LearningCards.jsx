import React from "react";

const LearningCards = ({
  selectedCategory,
  currentCardIndex,
  categories,
  learningCards,
  onCategoryClick,
  onBackToCategories,
  onNextCard,
  onPrevCard,
  onCardSelect,
}) => {
  const currentCards = learningCards[selectedCategory] || [];
  const currentCard = currentCards[currentCardIndex];

  if (selectedCategory === "showCategories") {
    return (
      <div className="knowledge-content">
        <button className="back-to-categories-btn" onClick={onBackToCategories}>
          ← Back to Main Menu
        </button>

        <div className="intro-section">
          <h2>🎓 Choose a Learning Topic</h2>
          <p>Explore bite-sized lessons on essential gardening concepts</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => onCategoryClick(category.id)}
              style={{ borderColor: category.color }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3>{category.name}</h3>
              <p>{learningCards[category.id].length} Cards</p>
              <div className="card-preview">
                {learningCards[category.id].slice(0, 3).map((card, idx) => (
                  <div
                    key={idx}
                    className="mini-card"
                    style={{ backgroundColor: card.color + "20" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="learning-cards-container">
      <div className="cards-header">
        <button className="back-to-categories-btn" onClick={onBackToCategories}>
          ← Back to Topics
        </button>
        <div className="progress-indicator">
          <span className="progress-text">
            Card {currentCardIndex + 1} of {currentCards.length}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentCardIndex + 1) / currentCards.length) * 100
                }%`,
                backgroundColor: currentCard.color,
              }}
            />
          </div>
        </div>
      </div>

      <div className="card-display">
        <div
          className="learning-card"
          style={{
            borderColor: currentCard.color,
            boxShadow: `0 10px 40px ${currentCard.color}40`,
          }}
        >
          <div className="card-icon" style={{ color: currentCard.color }}>
            {currentCard.icon}
          </div>
          <h2 className="card-title">{currentCard.title}</h2>
          <div
            className="card-tip"
            style={{ backgroundColor: currentCard.color + "20" }}
          >
            <span className="tip-label">💡 Quick Tip</span>
            <p>{currentCard.tip}</p>
          </div>
          <div className="card-details">
            <p>{currentCard.details}</p>
          </div>
          <div className="card-footer">
            <span
              className="card-category"
              style={{ backgroundColor: currentCard.color }}
            >
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="card-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={onPrevCard}
          disabled={currentCardIndex === 0}
          style={{
            opacity: currentCardIndex === 0 ? 0.3 : 1,
            cursor: currentCardIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Previous
        </button>
        <div className="dots-indicator">
          {currentCards.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentCardIndex ? "active" : ""}`}
              style={{
                backgroundColor:
                  index === currentCardIndex ? currentCard.color : "#ddd",
              }}
              onClick={() => onCardSelect(index)}
            />
          ))}
        </div>
        <button
          className="nav-btn next-btn"
          onClick={onNextCard}
          disabled={currentCardIndex === currentCards.length - 1}
          style={{
            opacity: currentCardIndex === currentCards.length - 1 ? 0.3 : 1,
            cursor:
              currentCardIndex === currentCards.length - 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next →
        </button>
      </div>

      <div className="card-grid-preview">
        {currentCards.map((card, index) => (
          <div
            key={card.id}
            className={`mini-preview-card ${
              index === currentCardIndex ? "active" : ""
            }`}
            onClick={() => onCardSelect(index)}
            style={{
              borderColor: card.color,
              backgroundColor:
                index === currentCardIndex ? card.color + "20" : "white",
            }}
          >
            <div className="mini-icon">{card.icon}</div>
            <p>{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningCards;
