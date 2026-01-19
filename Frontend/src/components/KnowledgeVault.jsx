import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantGuides } from "../data/plantGuidesData";
import PlantGlossary from "./PlantGlossary";
import PlantCheatSheets from "./PlantCheatSheets";
import PlantQuiz from "./PlantQuiz";
import "./KnowledgeVault.css";

const KnowledgeVault = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showGuides, setShowGuides] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showCheatSheets, setShowCheatSheets] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Learning Cards Data - EXPANDED TO 12 CATEGORIES
  const learningCards = {
    watering: [
      {
        id: 1,
        title: "Watering Basics",
        tip: "Water deeply but less frequently to encourage deep root growth.",
        icon: "💧",
        details:
          "Most plants prefer deep watering once or twice a week rather than shallow daily watering. This promotes stronger root systems.",
        color: "#4fc3f7",
      },
      {
        id: 2,
        title: "Morning Water Rule",
        tip: "Water plants early morning for best absorption.",
        icon: "🌅",
        details:
          "Morning watering reduces evaporation and helps prevent fungal diseases. The soil absorbs water better when it's cooler.",
        color: "#81c784",
      },
      {
        id: 3,
        title: "Drainage Check",
        tip: "Ensure proper drainage to prevent root rot.",
        icon: "🏺",
        details:
          "Poor drainage can suffocate roots and cause plant death. Always check drainage holes and use well-draining soil.",
        color: "#ffb74d",
      },
      {
        id: 4,
        title: "Soil Moisture Test",
        tip: "Stick your finger 2 inches into soil to check moisture.",
        icon: "👆",
        details:
          "If soil feels dry at 2 inches depth, it's time to water. Surface dryness doesn't always mean the plant needs water.",
        color: "#ba68c8",
      },
      {
        id: 5,
        title: "Water Quality",
        tip: "Use room temperature water for healthier plants.",
        icon: "🌡️",
        details:
          "Cold water can shock roots. Let tap water sit overnight to reach room temperature and allow chlorine to evaporate.",
        color: "#4dd0e1",
      },
      {
        id: 6,
        title: "Seasonal Adjustments",
        tip: "Reduce watering in winter, increase in summer.",
        icon: "📅",
        details:
          "Plants need less water during dormant winter months. Increase frequency during hot summer when evaporation is high.",
        color: "#aed581",
      },
    ],
    sunlight: [
      {
        id: 1,
        title: "Light Intensity",
        tip: "Full sun means 6+ hours of direct sunlight daily.",
        icon: "☀️",
        details:
          "Full sun: 6+ hours, Partial sun: 3-6 hours, Shade: less than 3 hours. Choose plants according to your available light.",
        color: "#ffd54f",
      },
      {
        id: 2,
        title: "Window Direction",
        tip: "South-facing windows get the most light.",
        icon: "🪟",
        details:
          "South: brightest and hottest, East: gentle morning sun, West: intense afternoon sun, North: least light.",
        color: "#64b5f6",
      },
      {
        id: 3,
        title: "Light Signs",
        tip: "Leggy growth means insufficient light.",
        icon: "📏",
        details:
          "Plants stretching toward light, pale leaves, or slow growth indicate need for more sunlight. Move closer to windows.",
        color: "#aed581",
      },
      {
        id: 4,
        title: "Seasonal Changes",
        tip: "Adjust plant position as seasons change.",
        icon: "🍂",
        details:
          "Sun angle changes with seasons. Move plants closer to windows in winter, further away in intense summer heat.",
        color: "#ff8a65",
      },
      {
        id: 5,
        title: "Artificial Lighting",
        tip: "LED grow lights can supplement natural light.",
        icon: "💡",
        details:
          "Use full-spectrum LED grow lights 12-16 hours daily for plants that don't get enough natural light.",
        color: "#9575cd",
      },
      {
        id: 6,
        title: "Sunburn Prevention",
        tip: "Acclimate plants slowly to prevent leaf burn.",
        icon: "🔥",
        details:
          "When moving plants to brighter spots, do it gradually over 1-2 weeks to prevent sunburn damage to leaves.",
        color: "#ff7043",
      },
    ],
    soil: [
      {
        id: 1,
        title: "Soil pH Matters",
        tip: "Most plants prefer slightly acidic soil (6.0-7.0 pH).",
        icon: "🧪",
        details:
          "Test soil pH regularly. Adjust with lime to raise pH or sulfur to lower it. Different plants have different pH preferences.",
        color: "#8d6e63",
      },
      {
        id: 2,
        title: "Organic Matter",
        tip: "Add compost to improve soil structure.",
        icon: "🌱",
        details:
          "Compost improves drainage, water retention, and provides nutrients. Mix 2-3 inches into top soil annually.",
        color: "#66bb6a",
      },
      {
        id: 3,
        title: "Fertilizer Timing",
        tip: "Fertilize during growing season (spring-summer).",
        icon: "⏰",
        details:
          "Plants need more nutrients when actively growing. Reduce or stop fertilizing in fall and winter dormancy.",
        color: "#26a69a",
      },
      {
        id: 4,
        title: "Soil Refreshing",
        tip: "Refresh potting soil annually for container plants.",
        icon: "♻️",
        details:
          "Old soil loses nutrients and structure. Replace or refresh top 2-3 inches every spring for optimal growth.",
        color: "#7e57c2",
      },
      {
        id: 5,
        title: "Mulching Benefits",
        tip: "Apply 2-3 inch mulch layer around plants.",
        icon: "🍂",
        details:
          "Mulch retains moisture, regulates temperature, suppresses weeds, and adds organic matter as it decomposes.",
        color: "#a1887f",
      },
      {
        id: 6,
        title: "Soil Aeration",
        tip: "Loosen compacted soil for better root growth.",
        icon: "🔧",
        details:
          "Use a fork to gently aerate soil without disturbing roots. This improves water penetration and oxygen flow.",
        color: "#78909c",
      },
    ],
    pests: [
      {
        id: 1,
        title: "Early Detection",
        tip: "Check plants weekly for pest signs.",
        icon: "🔍",
        details:
          "Look for holes in leaves, sticky residue, webbing, or tiny insects. Early detection prevents major infestations.",
        color: "#ef5350",
      },
      {
        id: 2,
        title: "Natural Spray",
        tip: "Neem oil spray controls most common pests.",
        icon: "💦",
        details:
          "Mix 2 tablespoons neem oil with 1 gallon water. Spray weekly for prevention, daily for active treatment.",
        color: "#66bb6a",
      },
      {
        id: 3,
        title: "Isolation First",
        tip: "Quarantine new plants for 2 weeks.",
        icon: "🚫",
        details:
          "Keep new plants separate to prevent introducing pests. Inspect thoroughly before integrating into your collection.",
        color: "#ffa726",
      },
      {
        id: 4,
        title: "Beneficial Insects",
        tip: "Ladybugs and lacewings eat harmful pests.",
        icon: "🐞",
        details:
          "Encourage beneficial insects in your garden. They're natural pest control and completely safe for plants.",
        color: "#42a5f5",
      },
      {
        id: 5,
        title: "Soap Solution",
        tip: "Insecticidal soap kills soft-bodied insects.",
        icon: "🧼",
        details:
          "Mix 1 tablespoon dish soap in 1 quart water. Spray on aphids, mealybugs, and whiteflies. Rinse after 2 hours.",
        color: "#5c6bc0",
      },
      {
        id: 6,
        title: "Prevention is Key",
        tip: "Healthy plants resist pests better.",
        icon: "🛡️",
        details:
          "Strong, well-maintained plants naturally resist pest attacks. Proper watering, light, and nutrients build immunity.",
        color: "#26a69a",
      },
    ],
    care: [
      {
        id: 1,
        title: "Pruning Benefits",
        tip: "Regular pruning promotes bushier growth.",
        icon: "✂️",
        details:
          "Remove dead leaves and trim leggy stems. Pruning encourages branching and creates fuller, healthier plants.",
        color: "#26c6da",
      },
      {
        id: 2,
        title: "Repotting Time",
        tip: "Repot when roots circle the pot bottom.",
        icon: "🪴",
        details:
          "Root-bound plants need larger containers. Repot in spring when plants are actively growing for best results.",
        color: "#ab47bc",
      },
      {
        id: 3,
        title: "Humidity Needs",
        tip: "Group plants together to increase humidity.",
        icon: "💨",
        details:
          "Plants release moisture through transpiration. Grouping them creates a beneficial micro-humid environment.",
        color: "#29b6f6",
      },
      {
        id: 4,
        title: "Temperature Control",
        tip: "Avoid placing plants near heating/cooling vents.",
        icon: "🌡️",
        details:
          "Sudden temperature changes stress plants. Keep away from drafts, heaters, and AC units for stable conditions.",
        color: "#ff7043",
      },
      {
        id: 5,
        title: "Leaf Cleaning",
        tip: "Wipe leaves monthly with damp cloth.",
        icon: "🧽",
        details:
          "Dust blocks light absorption. Gently wipe leaves to keep them clean and improve photosynthesis efficiency.",
        color: "#4db6ac",
      },
      {
        id: 6,
        title: "Support Stakes",
        tip: "Use stakes for tall or climbing plants.",
        icon: "🎋",
        details:
          "Provide support before plants become too heavy. Use bamboo stakes, trellises, or moss poles for climbing varieties.",
        color: "#7986cb",
      },
    ],
    problems: [
      {
        id: 1,
        title: "Yellow Leaves",
        tip: "Yellow leaves often mean overwatering.",
        icon: "🍂",
        details:
          "Check soil moisture. If soggy, reduce watering. If dry, could be nutrient deficiency or natural aging.",
        color: "#ffca28",
      },
      {
        id: 2,
        title: "Brown Leaf Tips",
        tip: "Brown tips indicate low humidity or over-fertilizing.",
        icon: "🥀",
        details:
          "Increase humidity with misting or pebble trays. Flush soil if over-fertilized. Trim brown tips for aesthetics.",
        color: "#8d6e63",
      },
      {
        id: 3,
        title: "Drooping Plants",
        tip: "Drooping can mean under or over-watering.",
        icon: "😔",
        details:
          "Check soil: dry means underwater, soggy means overwater. Adjust watering schedule and check drainage.",
        color: "#90a4ae",
      },
      {
        id: 4,
        title: "Slow Growth",
        tip: "Slow growth may need more light or nutrients.",
        icon: "🐌",
        details:
          "Move to brighter location or fertilize during growing season. Check if plant is root-bound and needs repotting.",
        color: "#9575cd",
      },
      {
        id: 5,
        title: "Wilting Despite Water",
        tip: "Wilting with wet soil indicates root rot.",
        icon: "⚠️",
        details:
          "Root rot from overwatering prevents water uptake. Remove affected roots, repot in fresh soil, reduce watering.",
        color: "#e57373",
      },
      {
        id: 6,
        title: "Leaf Drop",
        tip: "Sudden leaf drop signals stress or change.",
        icon: "🍃",
        details:
          "Common after moving plants or environmental changes. Maintain consistent care, avoid sudden moves or temperature shifts.",
        color: "#ffb74d",
      },
    ],
    propagation: [
      {
        id: 1,
        title: "Cutting Method",
        tip: "Take 4-6 inch cuttings from healthy stems.",
        icon: "🌿",
        details:
          "Cut just below a node at 45-degree angle. Remove lower leaves and place in water or moist soil until roots form.",
        color: "#66bb6a",
      },
      {
        id: 2,
        title: "Water Propagation",
        tip: "Change water every 3-4 days for cuttings.",
        icon: "💧",
        details:
          "Use clean jar with room temperature water. Place in bright indirect light. Roots typically form in 2-4 weeks.",
        color: "#4fc3f7",
      },
      {
        id: 3,
        title: "Division Method",
        tip: "Divide plants during repotting in spring.",
        icon: "✂️",
        details:
          "Gently separate root ball into sections, each with leaves and roots. Plant divisions in individual pots with fresh soil.",
        color: "#ab47bc",
      },
      {
        id: 4,
        title: "Rooting Hormone",
        tip: "Dip cuttings in rooting powder for faster roots.",
        icon: "🧪",
        details:
          "Rooting hormone contains growth hormones that stimulate root development. Especially helpful for woody stem cuttings.",
        color: "#9575cd",
      },
      {
        id: 5,
        title: "Leaf Propagation",
        tip: "Some plants grow from single leaves.",
        icon: "🍃",
        details:
          "Succulents and African violets can grow from leaves. Place on moist soil, don't bury. New plants form in 4-8 weeks.",
        color: "#81c784",
      },
      {
        id: 6,
        title: "Best Timing",
        tip: "Propagate in spring for highest success.",
        icon: "🌸",
        details:
          "Plants actively growing in spring have most energy for producing roots. Avoid propagating during dormant winter months.",
        color: "#ffb74d",
      },
    ],
    indoor: [
      {
        id: 1,
        title: "Air Circulation",
        tip: "Use gentle fan for air movement.",
        icon: "🌀",
        details:
          "Good air flow prevents fungal diseases and strengthens stems. Use oscillating fan on low setting for few hours daily.",
        color: "#4dd0e1",
      },
      {
        id: 2,
        title: "Pet Safety",
        tip: "Research if plants are toxic to pets.",
        icon: "🐱",
        details:
          "Many common houseplants are toxic to cats and dogs. Choose pet-safe varieties or place toxic plants out of reach.",
        color: "#ef5350",
      },
      {
        id: 3,
        title: "Dust Removal",
        tip: "Shower plants monthly to remove dust.",
        icon: "🚿",
        details:
          "Place plants in shower for gentle rinse. This removes dust, refreshes leaves, and can dislodge small pests.",
        color: "#42a5f5",
      },
      {
        id: 4,
        title: "Rotate Plants",
        tip: "Turn plants weekly for even growth.",
        icon: "🔄",
        details:
          "Plants grow toward light source. Rotating 1/4 turn weekly ensures all sides get equal light for balanced growth.",
        color: "#66bb6a",
      },
      {
        id: 5,
        title: "Humidity Trays",
        tip: "Use pebble trays to increase humidity.",
        icon: "🗿",
        details:
          "Fill tray with pebbles and water. Place pot on pebbles above water level. Evaporation creates humid microclimate.",
        color: "#26a69a",
      },
      {
        id: 6,
        title: "Winter Care",
        tip: "Reduce watering in winter months.",
        icon: "❄️",
        details:
          "Most houseplants go semi-dormant in winter. Reduce watering frequency by 30-50% and stop fertilizing until spring.",
        color: "#90caf9",
      },
    ],
    outdoor: [
      {
        id: 1,
        title: "Hardening Off",
        tip: "Acclimate indoor plants gradually to outdoors.",
        icon: "🌤️",
        details:
          "Move plants outside for 1-2 hours daily, increasing time over 7-10 days. This prevents shock from sudden environment change.",
        color: "#ffd54f",
      },
      {
        id: 2,
        title: "Wind Protection",
        tip: "Protect plants from strong winds.",
        icon: "💨",
        details:
          "Place windbreaks or position plants near walls. Strong winds can damage leaves and dry out soil quickly.",
        color: "#4fc3f7",
      },
      {
        id: 3,
        title: "Companion Planting",
        tip: "Plant compatible species together.",
        icon: "👥",
        details:
          "Some plants benefit each other: tomatoes with basil, marigolds repel pests. Research good companion combinations.",
        color: "#66bb6a",
      },
      {
        id: 4,
        title: "Frost Protection",
        tip: "Cover plants when frost is expected.",
        icon: "🧊",
        details:
          "Use frost cloth or sheets to protect tender plants. Remove covers during day to prevent overheating.",
        color: "#90caf9",
      },
      {
        id: 5,
        title: "Rain Collection",
        tip: "Use rain barrels for natural irrigation.",
        icon: "🌧️",
        details:
          "Rainwater is chlorine-free and room temperature. Collect in barrels for watering during dry periods.",
        color: "#4dd0e1",
      },
      {
        id: 6,
        title: "Seasonal Cleanup",
        tip: "Remove dead foliage to prevent disease.",
        icon: "🧹",
        details:
          "Clean up fallen leaves and dead plant material regularly. This prevents fungal diseases and pest hiding spots.",
        color: "#a1887f",
      },
    ],
    seasonal: [
      {
        id: 1,
        title: "Spring Planting",
        tip: "Start seeds indoors 6-8 weeks before last frost.",
        icon: "🌸",
        details:
          "Spring is ideal for starting most vegetables and flowers. Check your local frost dates and start accordingly.",
        color: "#e91e63",
      },
      {
        id: 2,
        title: "Summer Maintenance",
        tip: "Water deeply during hot summer months.",
        icon: "☀️",
        details:
          "Increase watering frequency, provide shade for sensitive plants, and mulch heavily to retain moisture.",
        color: "#ff9800",
      },
      {
        id: 3,
        title: "Fall Preparation",
        tip: "Plant spring bulbs in fall for next year.",
        icon: "🍂",
        details:
          "Fall is perfect for planting tulips, daffodils, and other spring bulbs. Also time to divide perennials.",
        color: "#ff5722",
      },
      {
        id: 4,
        title: "Winter Protection",
        tip: "Mulch heavily to protect roots from freezing.",
        icon: "❄️",
        details:
          "Apply 4-6 inches of mulch around plants. Wrap tender plants with burlap for extra protection.",
        color: "#03a9f4",
      },
      {
        id: 5,
        title: "Seasonal Pruning",
        tip: "Prune most plants in late winter or early spring.",
        icon: "✂️",
        details:
          "Prune before new growth begins. Remove dead, damaged, or crossing branches. Summer-flowering shrubs prune after bloom.",
        color: "#8bc34a",
      },
      {
        id: 6,
        title: "Harvest Timing",
        tip: "Harvest vegetables in morning for best flavor.",
        icon: "🌾",
        details:
          "Morning harvest ensures vegetables are crisp and hydrated. Pick regularly to encourage more production.",
        color: "#ffc107",
      },
    ],
    containers: [
      {
        id: 1,
        title: "Pot Size Matters",
        tip: "Choose pots 2 inches larger than root ball.",
        icon: "🪴",
        details:
          "Too large pots retain excess moisture, too small restricts growth. Ensure proper drainage holes.",
        color: "#795548",
      },
      {
        id: 2,
        title: "Container Soil Mix",
        tip: "Use lightweight potting mix, not garden soil.",
        icon: "🌱",
        details:
          "Potting mix drains better and is sterile. Garden soil compacts in containers and may contain pests.",
        color: "#8d6e63",
      },
      {
        id: 3,
        title: "Drainage Essentials",
        tip: "Add drainage layer at bottom of pots.",
        icon: "⬇️",
        details:
          "Place pebbles or broken pottery shards at bottom. This prevents soil from blocking drainage holes.",
        color: "#607d8b",
      },
      {
        id: 4,
        title: "Container Feeding",
        tip: "Fertilize container plants more frequently.",
        icon: "🍽️",
        details:
          "Nutrients wash out faster in containers. Feed every 2-3 weeks during growing season with diluted fertilizer.",
        color: "#4caf50",
      },
      {
        id: 5,
        title: "Root Pruning",
        tip: "Trim circling roots when repotting.",
        icon: "✂️",
        details:
          "Gently tease out circling roots and trim dead ones. This encourages new root growth in fresh soil.",
        color: "#9c27b0",
      },
      {
        id: 6,
        title: "Material Matters",
        tip: "Terracotta breathes, plastic retains moisture.",
        icon: "🏺",
        details:
          "Terracotta great for plants needing dry conditions. Plastic better for moisture-loving plants. Ceramic offers middle ground.",
        color: "#ff5722",
      },
    ],
    organic: [
      {
        id: 1,
        title: "Compost Basics",
        tip: "Mix green and brown materials 1:2 ratio.",
        icon: "♻️",
        details:
          "Green materials (nitrogen): food scraps, grass. Brown materials (carbon): leaves, cardboard. Keep moist and turn weekly.",
        color: "#689f38",
      },
      {
        id: 2,
        title: "Natural Fertilizers",
        tip: "Coffee grounds provide nitrogen boost.",
        icon: "☕",
        details:
          "Mix used coffee grounds into soil or compost. Rich in nitrogen, good for acid-loving plants like roses.",
        color: "#5d4037",
      },
      {
        id: 3,
        title: "Banana Peel Magic",
        tip: "Bury banana peels for potassium boost.",
        icon: "🍌",
        details:
          "Chop and bury around plants or steep in water for liquid fertilizer. Excellent for flowering plants.",
        color: "#ffeb3b",
      },
      {
        id: 4,
        title: "Eggshell Calcium",
        tip: "Crushed eggshells add calcium to soil.",
        icon: "🥚",
        details:
          "Dry, crush, and mix into soil. Helps prevent blossom end rot in tomatoes. Takes time to break down.",
        color: "#f5f5f5",
      },
      {
        id: 5,
        title: "Organic Pest Control",
        tip: "Plant marigolds to repel garden pests.",
        icon: "🌼",
        details:
          "Marigolds repel aphids, mosquitoes, and nematodes. Plant around vegetable gardens as natural pest barrier.",
        color: "#ff9800",
      },
      {
        id: 6,
        title: "Worm Castings",
        tip: "Vermicompost is nature's perfect fertilizer.",
        icon: "🪱",
        details:
          "Worm castings rich in nutrients and beneficial microbes. Use as top dressing or steep for compost tea.",
        color: "#6d4c41",
      },
    ],
  };

  const categories = [
    { id: "watering", name: "Watering", icon: "💧", color: "#4fc3f7" },
    { id: "sunlight", name: "Sunlight", icon: "☀️", color: "#ffd54f" },
    { id: "soil", name: "Soil & Nutrients", icon: "🌱", color: "#66bb6a" },
    { id: "pests", name: "Pest Control", icon: "🐛", color: "#ef5350" },
    { id: "care", name: "Plant Care", icon: "🌿", color: "#26c6da" },
    { id: "problems", name: "Common Problems", icon: "🔧", color: "#ab47bc" },
    { id: "propagation", name: "Propagation", icon: "✨", color: "#9575cd" },
    { id: "indoor", name: "Indoor Growing", icon: "🏠", color: "#4dd0e1" },
    { id: "outdoor", name: "Outdoor Growing", icon: "🌳", color: "#66bb6a" },
    { id: "seasonal", name: "Seasonal Care", icon: "📅", color: "#e91e63" },
    {
      id: "containers",
      name: "Container Gardening",
      icon: "🪴",
      color: "#795548",
    },
    { id: "organic", name: "Organic Methods", icon: "🌿", color: "#689f38" },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentCardIndex(0);
  };

  const handleNextCard = () => {
    if (
      selectedCategory &&
      currentCardIndex < learningCards[selectedCategory].length - 1
    ) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentCardIndex(0);
  };

  const handleBackToGuides = () => {
    setSelectedGuide(null);
  };

  const handleBackToMain = () => {
    setShowGuides(false);
    setSelectedGuide(null);
    setSelectedCategory(null);
  };

  const handleShowCategories = () => {
    setShowGuides(false);
    setSelectedCategory("showCategories"); // Temporary state to show categories
  };

  // Add new handler for glossary
  const handleShowGlossary = () => {
    setShowGlossary(true);
    setShowGuides(false);
    setSelectedCategory(null);
  };

  const handleBackFromGlossary = () => {
    setShowGlossary(false);
  };

  // Add new handler for cheat sheets
  const handleShowCheatSheets = () => {
    setShowCheatSheets(true);
    setShowGlossary(false);
    setShowGuides(false);
    setSelectedCategory(null);
  };

  const handleBackFromCheatSheets = () => {
    setShowCheatSheets(false);
  };

  // Add new handler for quiz
  const handleShowQuiz = () => {
    setShowQuiz(true);
    setShowCheatSheets(false);
    setShowGlossary(false);
    setShowGuides(false);
    setSelectedCategory(null);
  };

  const handleBackFromQuiz = () => {
    setShowQuiz(false);
  };

  const getCurrentCards = () => {
    if (!selectedCategory || selectedCategory === "showCategories") {
      return [];
    }
    return learningCards[selectedCategory] || [];
  };

  const currentCards = getCurrentCards();
  const currentCard = currentCards[currentCardIndex];

  // Show quiz if selected
  if (showQuiz) {
    return <PlantQuiz onBack={handleBackFromQuiz} />;
  }

  // Show cheat sheets if selected
  if (showCheatSheets) {
    return <PlantCheatSheets onBack={handleBackFromCheatSheets} />;
  }

  // Show glossary if selected
  if (showGlossary) {
    return <PlantGlossary onBack={handleBackFromGlossary} />;
  }

  return (
    <div className="knowledge-vault-container">
      <div className="knowledge-vault-header">
        <h1>🌿 Knowledge Vault</h1>
        <p>Learn plant care through interactive micro-lessons</p>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      {/* MAIN PAGE - Now with 5 cards */}
      {!selectedCategory && !showGuides && !selectedGuide ? (
        <div className="knowledge-content">
          <div className="intro-section">
            <h2>🎓 Choose Your Learning Path</h2>
            <p>Explore bite-sized lessons, guides, or test your knowledge</p>
          </div>

          <div className="learning-paths">
            {/* Feature 1 */}
            <div className="learning-path-card" onClick={handleShowCategories}>
              <div className="path-icon">📚</div>
              <h3>Learning Cards</h3>
              <p>Quick tips organized by topics</p>
              <span className="path-count">12 Categories • 72 Cards</span>
            </div>

            {/* Feature 2 */}
            <div
              className="learning-path-card"
              onClick={() => setShowGuides(true)}
            >
              <div className="path-icon">📋</div>
              <h3>Step-by-Step Guides</h3>
              <p>Detailed instructions for common tasks</p>
              <span className="path-count">
                {plantGuides.length} Complete Guides
              </span>
            </div>

            {/* Feature 3 */}
            <div className="learning-path-card" onClick={handleShowGlossary}>
              <div className="path-icon">📖</div>
              <h3>Plant Glossary</h3>
              <p>A-Z gardening terms with definitions</p>
              <span className="path-count">110+ Terms • English & Urdu</span>
            </div>

            {/* Feature 4 */}
            <div className="learning-path-card" onClick={handleShowCheatSheets}>
              <div className="path-icon">📄</div>
              <h3>Cheat Sheets</h3>
              <p>Printable one-page plant care guides</p>
              <span className="path-count">8 Plants • Download PDF</span>
            </div>

            {/* Feature 5 */}
            <div className="learning-path-card" onClick={handleShowQuiz}>
              <div className="path-icon">🎯</div>
              <h3>Interactive Quizzes</h3>
              <p>Test your plant knowledge</p>
              <span className="path-count">12 Quizzes • Easy to Hard</span>
            </div>
          </div>
        </div>
      ) : selectedCategory === "showCategories" ? (
        // Show categories page
        <div className="knowledge-content">
          <button className="back-to-categories-btn" onClick={handleBackToMain}>
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
                onClick={() => handleCategoryClick(category.id)}
                style={{ borderColor: category.color }}
              >
                <div
                  className="category-icon"
                  style={{ color: category.color }}
                >
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
      ) : showGuides && !selectedGuide ? (
        // Show guides page
        <div className="guides-section">
          <button className="back-to-categories-btn" onClick={handleBackToMain}>
            ← Back to Main Menu
          </button>

          <div className="guides-header">
            <h2>� Step-by-Step Plant Guides</h2>
            <p>Follow comprehensive instructions for successful plant care</p>
          </div>

          <div className="guides-grid">
            {plantGuides.map((guide) => (
              <div
                key={guide.id}
                className="guide-card"
                onClick={() => setSelectedGuide(guide)}
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
                <p className="guide-description">{guide.description}</p>
                <div className="guide-meta">
                  <span>⏱️ {guide.time}</span>
                  <span>📑 {guide.steps.length} Steps</span>
                </div>
                <p className="guide-category">{guide.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : selectedGuide ? (
        // Guide detail view
        <div className="guide-detail">
          <div className="guide-detail-header">
            <button className="back-to-guides-btn" onClick={handleBackToGuides}>
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
                <p className="guide-subtitle">{selectedGuide.description}</p>
                <div className="guide-info-row">
                  <span className="info-badge">
                    📂 {selectedGuide.category}
                  </span>
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

          {/* Materials Needed Section */}
          {selectedGuide.materials && (
            <div className="materials-section">
              <h3>📦 Materials Needed</h3>
              <div className="materials-grid">
                {selectedGuide.materials.map((material, index) => (
                  <div key={index} className="material-item">
                    <span className="material-icon">✓</span>
                    <span>{material}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    <span className="tip-text">
                      <strong>Pro Tip:</strong> {step.tip}
                    </span>
                  </div>
                  {step.warning && (
                    <div className="step-warning">
                      <span className="warning-icon">⚠️</span>
                      <span className="warning-text">
                        <strong>Warning:</strong> {step.warning}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Common Mistakes Section */}
          {selectedGuide.commonMistakes && (
            <div className="mistakes-section">
              <h3>❌ Common Mistakes to Avoid</h3>
              <ul className="mistakes-list">
                {selectedGuide.commonMistakes.map((mistake, index) => (
                  <li key={index}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Indicators Section */}
          {selectedGuide.successIndicators && (
            <div className="success-section">
              <h3>✅ Signs of Success</h3>
              <ul className="success-list">
                {selectedGuide.successIndicators.map((indicator, index) => (
                  <li key={index}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="guide-completion">
            <div
              className="completion-card"
              style={{ borderColor: selectedGuide.color }}
            >
              <h3>🎉 Great Job!</h3>
              <p>You've completed the guide for {selectedGuide.title}</p>
              <button
                className="back-to-guides-btn"
                onClick={handleBackToGuides}
                style={{ background: selectedGuide.color }}
              >
                View More Guides
              </button>
            </div>
          </div>
        </div>
      ) : currentCard ? (
        // Show individual cards - ONLY if currentCard exists
        <div className="learning-cards-container">
          <div className="cards-header">
            <button
              className="back-to-categories-btn"
              onClick={handleBackToCategories}
            >
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
              onClick={handlePrevCard}
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
                  className={`dot ${
                    index === currentCardIndex ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      index === currentCardIndex ? currentCard.color : "#ddd",
                  }}
                  onClick={() => setCurrentCardIndex(index)}
                />
              ))}
            </div>
            <button
              className="nav-btn next-btn"
              onClick={handleNextCard}
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
                onClick={() => setCurrentCardIndex(index)}
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
      ) : null}
    </div>
  );
};

export default KnowledgeVault;
