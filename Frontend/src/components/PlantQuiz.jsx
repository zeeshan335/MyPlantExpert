import React, { useState, useEffect } from "react";
import {
  plantQuizzes,
  getQuizzesByDifficulty,
  quizDifficulties,
} from "../data/plantQuizzesData";
import "./PlantQuiz.css";

const badges = {
  perfectScore: {
    name: "Perfect Score",
    description: "Achieve a perfect score on a quiz.",
    requirement: "Score 100% on any quiz",
    icon: "🏆",
    color: "#4caf50",
  },
  speedster: {
    name: "Speedster",
    description: "Complete a quiz in under 2 minutes.",
    requirement: "Finish any quiz within 2 minutes",
    icon: "⚡",
    color: "#ff9800",
  },
  beginner: {
    name: "Beginner Gardener",
    description: "Complete your first quiz.",
    requirement: "Finish 1 quiz",
    icon: "🌱",
    color: "#2196f3",
  },
  intermediate: {
    name: "Intermediate Gardener",
    description: "Complete 3 quizzes.",
    requirement: "Finish 3 quizzes",
    icon: "🌿",
    color: "#ff5722",
  },
  advanced: {
    name: "Advanced Gardener",
    description: "Complete 5 quizzes.",
    requirement: "Finish 5 quizzes",
    icon: "🍃",
    color: "#9c27b0",
  },
  master: {
    name: "Master Gardener",
    description: "Complete all available quizzes.",
    requirement: "Finish all quizzes",
    icon: "🌳",
    color: "#673ab7",
  },
};

const PlantQuiz = ({ onBack }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);

  const filteredQuizzes = getQuizzesByDifficulty(selectedDifficulty);

  // Load completed quizzes and badges from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("completedQuizzes");
    const savedBadges = localStorage.getItem("earnedBadges");
    if (saved) setCompletedQuizzes(JSON.parse(saved));
    if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
  }, []);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
    setAnsweredQuestions([]);
    setQuizStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const question = selectedQuiz.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: question.id,
        correct: isCorrect,
        selectedAnswer: selectedAnswer,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowExplanation(true);
  };

  const checkForNewBadges = (quizId, score, timeElapsed) => {
    const newBadges = [];
    const updatedCompleted = [...completedQuizzes, quizId];
    const percentage = getScorePercentage();

    // Perfect Score Badge
    if (percentage === 100 && !earnedBadges.includes("perfectScore")) {
      newBadges.push({ ...badges.perfectScore, id: "perfectScore" });
    }

    // Speed Badge (under 2 minutes)
    if (timeElapsed < 120000 && !earnedBadges.includes("speedster")) {
      newBadges.push({ ...badges.speedster, id: "speedster" });
    }

    // Progress Badges
    if (updatedCompleted.length >= 1 && !earnedBadges.includes("beginner")) {
      newBadges.push({ ...badges.beginner, id: "beginner" });
    }
    if (
      updatedCompleted.length >= 3 &&
      !earnedBadges.includes("intermediate")
    ) {
      newBadges.push({ ...badges.intermediate, id: "intermediate" });
    }
    if (updatedCompleted.length >= 5 && !earnedBadges.includes("advanced")) {
      newBadges.push({ ...badges.advanced, id: "advanced" });
    }
    if (
      updatedCompleted.length >= plantQuizzes.length &&
      !earnedBadges.includes("master")
    ) {
      newBadges.push({ ...badges.master, id: "master" });
    }

    // Save and show new badges
    if (newBadges.length > 0) {
      const updatedBadges = [...earnedBadges, ...newBadges.map((b) => b.id)];
      setEarnedBadges(updatedBadges);
      localStorage.setItem("earnedBadges", JSON.stringify(updatedBadges));
      setNewlyEarnedBadge(newBadges[0]);
      setShowBadgeModal(true);
    }

    // Save completed quiz
    localStorage.setItem("completedQuizzes", JSON.stringify(updatedCompleted));
    setCompletedQuizzes(updatedCompleted);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const timeElapsed = Date.now() - quizStartTime;
      setQuizComplete(true);
      checkForNewBadges(selectedQuiz.id, score, timeElapsed);
    }
  };

  const handleRestartQuiz = () => {
    startQuiz(selectedQuiz);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setQuizComplete(false);
  };

  const getScorePercentage = () => {
    return Math.round((score / selectedQuiz.questions.length) * 100);
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage === 100)
      return { text: "Perfect Score! 🎉", color: "#4caf50" };
    if (percentage >= 80) return { text: "Excellent! 🌟", color: "#66bb6a" };
    if (percentage >= 60) return { text: "Good Job! 👍", color: "#ff9800" };
    if (percentage >= 40)
      return { text: "Keep Learning! 📚", color: "#ff5722" };
    return { text: "Try Again! 💪", color: "#f44336" };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#4caf50";
      case "Medium":
        return "#ff9800";
      case "Hard":
        return "#f44336";
      default:
        return "#9c27b0";
    }
  };

  // Quiz Selection View
  if (!selectedQuiz) {
    return (
      <div className="plant-quiz-container">
        <div className="quiz-header">
          <button onClick={onBack} className="back-btn-quiz">
            ← Back to Knowledge Vault
          </button>
          <h1>🎯 Plant Care Quizzes</h1>
          <p>Test your gardening knowledge with interactive quizzes</p>
        </div>

        {/* Difficulty Filter */}
        <div className="difficulty-filter">
          {quizDifficulties.map((difficulty) => (
            <button
              key={difficulty}
              className={`difficulty-btn ${
                selectedDifficulty === difficulty ? "active" : ""
              }`}
              onClick={() => setSelectedDifficulty(difficulty)}
              style={{
                borderColor:
                  difficulty !== "All"
                    ? getDifficultyColor(difficulty)
                    : "#0f2d1a",
                color: selectedDifficulty === difficulty ? "white" : "#666",
                background:
                  selectedDifficulty === difficulty
                    ? difficulty !== "All"
                      ? getDifficultyColor(difficulty)
                      : "#0f2d1a"
                    : "white",
              }}
            >
              {difficulty}
            </button>
          ))}
        </div>

        {/* Quizzes Grid */}
        <div className="quizzes-grid">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="quiz-card"
              style={{ borderColor: quiz.color }}
              onClick={() => startQuiz(quiz)}
            >
              <div
                className="quiz-card-header"
                style={{ background: quiz.color + "20" }}
              >
                <span className="quiz-icon">{quiz.icon}</span>
                <span
                  className="quiz-difficulty-badge"
                  style={{ background: getDifficultyColor(quiz.difficulty) }}
                >
                  {quiz.difficulty}
                </span>
              </div>
              <div className="quiz-card-body">
                <h3 style={{ color: quiz.color }}>{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
                <div className="quiz-meta">
                  <span>📚 {quiz.category}</span>
                  <span>❓ {quiz.questions.length} Questions</span>
                </div>
                <button
                  className="start-quiz-btn"
                  style={{ background: quiz.color }}
                >
                  Start Quiz →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Complete View - Enhanced with Badge Display
  if (quizComplete) {
    const scoreMessage = getScoreMessage();
    const percentage = getScorePercentage();

    return (
      <div className="plant-quiz-container">
        <div className="quiz-complete-view">
          <div
            className="completion-card"
            style={{ borderColor: selectedQuiz.color }}
          >
            <div
              className="completion-icon"
              style={{ color: scoreMessage.color }}
            >
              {percentage === 100
                ? "🏆"
                : percentage >= 80
                ? "🌟"
                : percentage >= 60
                ? "👍"
                : "📚"}
            </div>
            <h2 style={{ color: scoreMessage.color }}>{scoreMessage.text}</h2>

            {/* Score Display */}
            <div className="score-display">
              <div
                className="score-circle"
                style={{ borderColor: selectedQuiz.color }}
              >
                <span className="score-number">{score}</span>
                <span className="score-total">
                  / {selectedQuiz.questions.length}
                </span>
              </div>
              <p
                className="score-percentage"
                style={{ color: selectedQuiz.color }}
              >
                {percentage}% Correct
              </p>
            </div>

            {/* Quiz Summary */}
            <div className="quiz-summary">
              <h3>Quiz Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">✅ Correct</span>
                  <span className="summary-value" style={{ color: "#4caf50" }}>
                    {score}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">❌ Incorrect</span>
                  <span className="summary-value" style={{ color: "#f44336" }}>
                    {selectedQuiz.questions.length - score}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">📊 Accuracy</span>
                  <span
                    className="summary-value"
                    style={{ color: selectedQuiz.color }}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Earned Badges Display */}
            {earnedBadges.length > 0 && (
              <div className="earned-badges-section">
                <h3>Your Achievements ({earnedBadges.length})</h3>
                <div className="badges-grid">
                  {earnedBadges.map((badgeId) => {
                    const badge = Object.values(badges).find(
                      (b) =>
                        Object.keys(badges).find((key) => badges[key] === b) ===
                        badgeId
                    );
                    return (
                      <div
                        key={badgeId}
                        className="badge-display"
                        style={{ background: badge?.color + "20" }}
                      >
                        <span className="badge-icon">{badge?.icon}</span>
                        <span className="badge-name">{badge?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completion Actions */}
            <div className="completion-actions">
              <button
                className="action-btn retry-btn"
                onClick={handleRestartQuiz}
                style={{ background: selectedQuiz.color }}
              >
                🔄 Retry Quiz
              </button>
              <button
                className="action-btn back-btn"
                onClick={handleBackToQuizzes}
              >
                📚 Browse Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Badge Earned Modal
  {
    showBadgeModal && newlyEarnedBadge && (
      <div
        className="badge-modal-overlay"
        onClick={() => setShowBadgeModal(false)}
      >
        <div
          className="badge-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="badge-celebration">
            <div className="confetti">🎉</div>
            <div
              className="badge-icon-large"
              style={{ color: newlyEarnedBadge.color }}
            >
              {newlyEarnedBadge.icon}
            </div>
            <h2 style={{ color: newlyEarnedBadge.color }}>Badge Earned!</h2>
            <h3>{newlyEarnedBadge.name}</h3>
            <p>{newlyEarnedBadge.description}</p>
            <p className="badge-requirement">{newlyEarnedBadge.requirement}</p>
            <button
              className="badge-ok-btn"
              onClick={() => setShowBadgeModal(false)}
              style={{ background: newlyEarnedBadge.color }}
            >
              Awesome! ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question View
  const question = selectedQuiz.questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="plant-quiz-container">
      <div className="quiz-header">
        <button onClick={handleBackToQuizzes} className="back-btn-quiz">
          ← Back to Quizzes
        </button>
        <div className="quiz-title-section">
          <h2>{selectedQuiz.title}</h2>
          <span className="quiz-progress">
            Question {currentQuestion + 1} of {selectedQuiz.questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{
            width: `${
              ((currentQuestion + 1) / selectedQuiz.questions.length) * 100
            }%`,
            background: selectedQuiz.color,
          }}
        />
      </div>

      {/* Question Card */}
      <div
        className="question-card"
        style={{ borderColor: selectedQuiz.color }}
      >
        <div
          className="question-header"
          style={{ background: selectedQuiz.color + "20" }}
        >
          <span className="question-icon">{selectedQuiz.icon}</span>
          <h3>Question {currentQuestion + 1}</h3>
        </div>

        <div className="question-body">
          <p className="question-text">{question.question}</p>

          {/* Answer Options */}
          <div className="answer-options">
            {question.options.map((option, index) => {
              let optionClass = "answer-option";
              if (showExplanation) {
                if (index === question.correctAnswer) {
                  optionClass += " correct";
                } else if (index === selectedAnswer) {
                  optionClass += " incorrect";
                }
              } else if (selectedAnswer === index) {
                optionClass += " selected";
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  {showExplanation && index === question.correctAnswer && (
                    <span className="option-icon">✓</span>
                  )}
                  {showExplanation &&
                    index === selectedAnswer &&
                    index !== question.correctAnswer && (
                      <span className="option-icon">✗</span>
                    )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`explanation-box ${
                isCorrect ? "correct" : "incorrect"
              }`}
            >
              <div className="explanation-header">
                <span className="explanation-icon">
                  {isCorrect ? "✅" : "❌"}
                </span>
                <strong>{isCorrect ? "Correct!" : "Incorrect"}</strong>
              </div>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="question-actions">
            {!showExplanation ? (
              <button
                className="submit-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                style={{ background: selectedQuiz.color }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="next-question-btn"
                onClick={handleNextQuestion}
                style={{ background: selectedQuiz.color }}
              >
                {currentQuestion < selectedQuiz.questions.length - 1
                  ? "Next Question →"
                  : "Complete Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="current-score">
        Score: <span style={{ color: selectedQuiz.color }}>{score}</span> /{" "}
        {selectedQuiz.questions.length}
      </div>
    </div>
  );
};

export default PlantQuiz;
