// filepath: d:\MyPlantExpert\Frontend\src\components\CrossBreedTool.jsx
import React, { useState, useEffect } from "react";
import "./CrossBreed.css";

// Static plant data with attributes commonly found in Pakistan
const plantData = [
  // Flowers
  {
    id: 1,
    name: "Gulab (Rose)",
    category: "Flower",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [2, 3, 7, 8, 22, 39, 42],
    image: "rose.jpg",
    description: "Pakistan's national flower with beautiful fragrant blooms",
  },
  {
    id: 2,
    name: "Champa",
    category: "Flower",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [1, 3, 8, 38, 41],
    image: "champa.jpg",
    description: "Fragrant yellow-white flowers popular in South Asia",
  },
  {
    id: 3,
    name: "Motia (Jasmine)",
    category: "Flower",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [1, 2, 7, 8, 40, 43],
    image: "jasmine.jpg",
    description: "Highly fragrant white flowers used in garlands",
  },
  {
    id: 8,
    name: "Gul-e-Daudi (Chrysanthemum)",
    category: "Flower",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [1, 2, 3, 38, 42],
    image: "chrysanthemum.jpg",
    description: "Popular autumn flower in various colors",
  },
  {
    id: 21,
    name: "Surajmukhi (Sunflower)",
    category: "Flower",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [1, 22, 23, 39, 43],
    image: "sunflower.jpg",
    description: "Tall flower with bright yellow petals and edible seeds",
  },
  {
    id: 22,
    name: "Genda (Marigold)",
    category: "Flower",
    water: "Low",
    sunlight: "Full sun",
    compatible: [1, 21, 23, 40, 41],
    image: "marigold.jpg",
    description: "Sacred orange-yellow flower used in ceremonies",
  },
  {
    id: 23,
    name: "Raat ki Rani",
    category: "Flower",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [1, 21, 22, 39, 40],
    image: "nightblooming.jpg",
    description: "Night-blooming jasmine with intense fragrance",
  },
  {
    id: 38,
    name: "Chandni",
    category: "Flower",
    water: "Medium",
    sunlight: "Partial sun",
    compatible: [2, 8, 41, 43],
    image: "chandni.jpg",
    description: "Fragrant white flowers that bloom abundantly",
  },
  {
    id: 39,
    name: "Nargis (Narcissus)",
    category: "Flower",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [1, 21, 23, 42],
    image: "narcissus.jpg",
    description: "White flowers with orange centers popular in poetry",
  },
  {
    id: 40,
    name: "Mehndi (Henna)",
    category: "Flower",
    water: "Low",
    sunlight: "Full sun",
    compatible: [3, 22, 23, 43],
    image: "henna.jpg",
    description: "Small fragrant flowers and leaves used for body art",
  },
  {
    id: 41,
    name: "Kaner (Oleander)",
    category: "Flower",
    water: "Low",
    sunlight: "Full sun",
    compatible: [2, 22, 38],
    image: "oleander.jpg",
    description: "Drought-resistant flowering shrub with pink or white blooms",
  },
  {
    id: 42,
    name: "Gul-e-Nargis (Daffodil)",
    category: "Flower",
    water: "Medium",
    sunlight: "Full/partial sun",
    compatible: [1, 8, 39],
    image: "daffodil.jpg",
    description: "Spring bulb with trumpet-shaped yellow flowers",
  },
  {
    id: 43,
    name: "Gurhal (Hibiscus)",
    category: "Flower",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [3, 21, 38, 40],
    image: "hibiscus.jpg",
    description: "Large colorful flowers used in teas and religious offerings",
  },

  // Vegetables
  {
    id: 4,
    name: "Tamatar (Tomato)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [5, 9, 13, 14, 31, 32],
    image: "tomato.jpg",
    description: "Essential ingredient in Pakistani cuisine",
  },
  {
    id: 5,
    name: "Kheera (Cucumber)",
    category: "Vegetable",
    water: "High",
    sunlight: "Full sun",
    compatible: [4, 11, 12, 14, 33, 34],
    image: "cucumber.jpg",
    description: "Refreshing vegetable commonly used in salads",
  },
  {
    id: 9,
    name: "Mirch (Chili Pepper)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [4, 7, 13, 31, 33],
    image: "chili.jpg",
    description: "Essential spice in Pakistani cooking, varying in heat",
  },
  {
    id: 11,
    name: "Gajar (Carrot)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full/partial sun",
    compatible: [5, 12, 14, 35, 36],
    image: "carrot.jpg",
    description: "Orange root vegetable used in many dishes and desserts",
  },
  {
    id: 12,
    name: "Piyaz (Onion)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [5, 11, 14, 32, 34],
    image: "onion.jpg",
    description: "Staple vegetable in Pakistani cooking",
  },
  {
    id: 13,
    name: "Baingan (Eggplant)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [4, 9, 31, 33],
    image: "eggplant.jpg",
    description: "Purple vegetable popular in many Pakistani dishes",
  },
  {
    id: 14,
    name: "Palak (Spinach)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [4, 5, 11, 35, 37],
    image: "spinach.jpg",
    description: "Nutritious leafy green used in sag dishes",
  },
  {
    id: 31,
    name: "Bhindi (Okra)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [4, 9, 13, 33],
    image: "okra.jpg",
    description: "Popular vegetable used in curries and fried dishes",
  },
  {
    id: 32,
    name: "Lehsun (Garlic)",
    category: "Vegetable",
    water: "Low",
    sunlight: "Full sun",
    compatible: [4, 12, 34, 36],
    image: "garlic.jpg",
    description: "Aromatic bulb used as a base in Pakistani cooking",
  },
  {
    id: 33,
    name: "Shimla Mirch (Bell Pepper)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [5, 9, 13, 31],
    image: "bellpepper.jpg",
    description: "Sweet, colorful peppers used in many dishes",
  },
  {
    id: 34,
    name: "Aloo (Potato)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [5, 12, 32, 36],
    image: "potato.jpg",
    description: "Staple starchy vegetable in Pakistani meals",
  },
  {
    id: 35,
    name: "Methi (Fenugreek)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [11, 14, 37],
    image: "fenugreek.jpg",
    description: "Bitter-tasting leaves used in saag and achar",
  },
  {
    id: 36,
    name: "Muli (Radish)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [11, 32, 34],
    image: "radish.jpg",
    description: "Crunchy root vegetable eaten raw or cooked",
  },
  {
    id: 37,
    name: "Saag (Mustard Greens)",
    category: "Vegetable",
    water: "Medium",
    sunlight: "Full/partial sun",
    compatible: [14, 35],
    image: "mustardgreens.jpg",
    description: "Popular leafy vegetable in Punjab region",
  },

  // Herbs
  {
    id: 6,
    name: "Tulsi (Holy Basil)",
    category: "Herb",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [7, 10, 16, 45, 48],
    image: "tulsi.jpg",
    description: "Sacred herb with medicinal properties",
  },
  {
    id: 7,
    name: "Pudina (Mint)",
    category: "Herb",
    water: "High",
    sunlight: "Partial shade",
    compatible: [6, 9, 15, 16, 44, 49],
    image: "mint.jpg",
    description: "Essential herb for chutneys and raita",
  },
  {
    id: 10,
    name: "Ajwain (Carom)",
    category: "Herb",
    water: "Low",
    sunlight: "Full sun",
    compatible: [6, 15, 17, 46, 47],
    image: "ajwain.jpg",
    description: "Aromatic herb used for digestive problems",
  },
  {
    id: 15,
    name: "Dhaniya (Coriander)",
    category: "Herb",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [7, 10, 16, 44, 47],
    image: "coriander.jpg",
    description: "Most popular herb in Pakistani cuisine",
  },
  {
    id: 16,
    name: "Lehsan (Garlic)",
    category: "Herb",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [6, 7, 15, 45, 49],
    image: "garlic.jpg",
    description: "Pungent herb used as a base in many dishes",
  },
  {
    id: 17,
    name: "Adrak (Ginger)",
    category: "Herb",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [10, 15, 16, 46, 48],
    image: "ginger.jpg",
    description: "Aromatic root used in teas and cooking",
  },
  {
    id: 44,
    name: "Kari Patta (Curry Leaf)",
    category: "Herb",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [7, 15, 47, 49],
    image: "curryleaf.jpg",
    description: "Aromatic leaf used for tempering in Pakistani dishes",
  },
  {
    id: 45,
    name: "Saunf (Fennel)",
    category: "Herb",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [6, 16, 46, 48],
    image: "fennel.jpg",
    description: "Sweet anise-flavored herb used in digestive remedies",
  },
  {
    id: 46,
    name: "Kalonji (Nigella)",
    category: "Herb",
    water: "Low",
    sunlight: "Full sun",
    compatible: [10, 17, 45, 50],
    image: "nigella.jpg",
    description: "Black seeds with medicinal properties used in naan",
  },
  {
    id: 47,
    name: "Zeera (Cumin)",
    category: "Herb",
    water: "Low",
    sunlight: "Full sun",
    compatible: [10, 15, 44, 50],
    image: "cumin.jpg",
    description: "Essential spice for garam masala and curries",
  },
  {
    id: 48,
    name: "Aloe Vera",
    category: "Herb",
    water: "Low",
    sunlight: "Partial sun",
    compatible: [6, 17, 45],
    image: "aloevera.jpg",
    description: "Medicinal plant used for skin treatments",
  },
  {
    id: 49,
    name: "Haldi (Turmeric)",
    category: "Herb",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [7, 16, 44],
    image: "turmeric.jpg",
    description: "Golden root used for flavor and medicinal purposes",
  },
  {
    id: 50,
    name: "Hari Elaichi (Green Cardamom)",
    category: "Herb",
    water: "Medium",
    sunlight: "Partial shade",
    compatible: [46, 47],
    image: "cardamom.jpg",
    description: "Fragrant pods used in tea and desserts",
  },

  // Fruits
  {
    id: 18,
    name: "Aam (Mango)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [19, 20, 24, 26],
    image: "mango.jpg",
    description: "King of fruits, Pakistan's speciality in summer",
  },
  {
    id: 19,
    name: "Falsa",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [18, 20, 25, 27],
    image: "falsa.jpg",
    description: "Small purple berry native to the subcontinent",
  },
  {
    id: 20,
    name: "Anar (Pomegranate)",
    category: "Fruit",
    water: "Low",
    sunlight: "Full sun",
    compatible: [18, 19, 24, 25],
    image: "pomegranate.jpg",
    description: "Ruby red seeds with sweet-tart flavor",
  },
  {
    id: 24,
    name: "Jamun (Black Plum)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [18, 20, 25, 26],
    image: "jamun.jpg",
    description: "Dark purple fruit with astringent taste, good for diabetes",
  },
  {
    id: 25,
    name: "Sharifa (Custard Apple)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [19, 20, 24, 27],
    image: "custardapple.jpg",
    description: "Sweet, creamy fruit with unique texture and flavor",
  },
  {
    id: 26,
    name: "Nashpati (Asian Pear)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [18, 24, 27, 28],
    image: "asianpear.jpg",
    description: "Crisp, juicy pear variety popular in northern Pakistan",
  },
  {
    id: 27,
    name: "Khubani (Apricot)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [19, 25, 26, 28],
    image: "apricot.jpg",
    description: "Golden-orange fruit speciality of Gilgit-Baltistan region",
  },
  {
    id: 28,
    name: "Kinnow (Mandarin)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [26, 27, 29, 30],
    image: "kinnow.jpg",
    description: "Sweet citrus fruit, Pakistan's famous export",
  },
  {
    id: 29,
    name: "Tarbuz (Watermelon)",
    category: "Fruit",
    water: "High",
    sunlight: "Full sun",
    compatible: [28, 30],
    image: "watermelon.jpg",
    description: "Refreshing summer fruit with juicy red flesh",
  },
  {
    id: 30,
    name: "Leechi (Lychee)",
    category: "Fruit",
    water: "Medium",
    sunlight: "Full sun",
    compatible: [28, 29],
    image: "lychee.jpg",
    description: "Sweet translucent fruit with bumpy red skin",
  },
];

// Get unique categories from plant data
const categories = [
  ...new Set(plantData.map((plant) => plant.category)),
].sort();

const CrossBreedTool = () => {
  // State variables
  const [plant1, setPlant1] = useState(null);
  const [plant2, setPlant2] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState("");
  const [selectedCategory2, setSelectedCategory2] = useState("");
  const [step, setStep] = useState(1); // Step 1: Category selection, Step 2: Plant selection
  const [language, setLanguage] = useState("en"); // Default language is English
  const [savedResults, setSavedResults] = useState([]);
  const [showSavedResultsModal, setShowSavedResultsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved results from localStorage when component mounts
  useEffect(() => {
    loadSavedResults();
  }, []);

  // Load saved cross-breed results from localStorage
  const loadSavedResults = () => {
    const storedResults = localStorage.getItem("crossBreedResults");
    if (storedResults) {
      setSavedResults(JSON.parse(storedResults));
    }
  };

  // Save current result to localStorage
  const saveCurrentResult = () => {
    if (!result) {
      alert("No result to save!");
      return;
    }

    setIsSaving(true);

    const resultToSave = {
      ...result,
      parent1: plant1.name,
      parent2: plant2.name,
      createdAt: { seconds: Date.now() / 1000 },
      id: Date.now().toString(),
    };

    // Get existing results from localStorage
    const existingResults = localStorage.getItem("crossBreedResults");
    let allResults = existingResults ? JSON.parse(existingResults) : [];

    // Add new result
    allResults.push(resultToSave);

    // Save back to localStorage
    localStorage.setItem("crossBreedResults", JSON.stringify(allResults));

    setIsSaving(false);
    alert("Cross-breeding result saved successfully! 🌱");
    loadSavedResults();
  };

  // Delete saved result from localStorage
  const deleteSavedResult = (resultId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (confirmDelete) {
      const existingResults = localStorage.getItem("crossBreedResults");
      if (existingResults) {
        let allResults = JSON.parse(existingResults);
        allResults = allResults.filter((r) => r.id !== resultId);
        localStorage.setItem("crossBreedResults", JSON.stringify(allResults));
        alert("Result deleted successfully!");
        loadSavedResults();
      }
    }
  };

  // Handle category and plant selection
  const handleCategory1Change = (e) => {
    const category = e.target.value;
    setSelectedCategory1(category);
    setPlant1(null);
    setResult(null);
    setError("");
  };

  const handleCategory2Change = (e) => {
    const category = e.target.value;
    setSelectedCategory2(category);
    setPlant2(null);
    setResult(null);
    setError("");
  };

  // Handle plant selection
  const handlePlant1Change = (e) => {
    const selectedPlant = plantData.find(
      (plant) => plant.id === parseInt(e.target.value)
    );
    setPlant1(selectedPlant);
    setResult(null);
    setError("");
  };

  const handlePlant2Change = (e) => {
    const selectedPlant = plantData.find(
      (plant) => plant.id === parseInt(e.target.value)
    );
    setPlant2(selectedPlant);
    setResult(null);
    setError("");
  };

  // Handle cross breeding
  const handleCrossBreed = () => {
    // Reset previous results
    setError("");
    setResult(null);

    // Validate category selections
    if (!selectedCategory1 || !selectedCategory2) {
      setError("Please select categories for both parent plants");
      return;
    }

    // Validate plant selections
    if (!plant1 || !plant2) {
      setError("Please select two plants to cross-breed");
      return;
    }

    // Check for same plant
    if (plant1.id === plant2.id) {
      setError(`Cannot cross-breed a plant with itself.`);
      return;
    }

    // Check if the plants are compatible
    if (plant1.compatible && plant1.compatible.includes(plant2.id)) {
      // Generate success rate
      const successRate = Math.floor(Math.random() * 31) + 60; // 60-90%

      // Create hybrid
      const hybrid = {
        name: `${plant1.name}-${plant2.name} Hybrid`,
        water: determineTraitDominance(plant1.water, plant2.water),
        sunlight: determineTraitDominance(plant1.sunlight, plant2.sunlight),
        successRate: successRate,
        description: `A hybrid plant combining traits of ${plant1.name} and ${plant2.name}.`,
        category:
          plant1.category === plant2.category ? plant1.category : "Hybrid",
      };

      setResult(hybrid);
    } else {
      setError(
        `${plant1.name} and ${plant2.name} are not compatible for cross-breeding.`
      );
    }
  };

  // Helper function to determine trait dominance
  const determineTraitDominance = (trait1, trait2) => {
    // Simple algorithm - 70% chance first parent's trait is dominant
    return Math.random() > 0.3 ? trait1 : trait2;
  };

  // Reset function
  const handleReset = () => {
    setSelectedCategory1("");
    setSelectedCategory2("");
    setPlant1(null);
    setPlant2(null);
    setResult(null);
    setError("");
    setStep(1);
  };

  // Continue to plant selection after category selection
  const handleContinueToPlantSelection = () => {
    if (!selectedCategory1) {
      setError("Please select a category for the first parent plant");
      return;
    }

    if (!selectedCategory2) {
      setError("Please select a category for the second parent plant");
      return;
    }

    setError("");
    setStep(2);
  };

  // Go back to category selection
  const handleBackToCategorySelection = () => {
    setStep(1);
  };

  // Handle language toggle
  const handleLanguageToggle = (lang) => {
    setLanguage(lang);
  };

  // Text translations
  const translations = {
    en: {
      selectCategories: "Select Categories",
      selectPlants: "Select Plants",
      viewResult: "View Result",
      selectPlantCategories: "Select Plant Categories",
      selectParentPlants: "Select Parent Plants",
      chooseCategories: "First, choose the categories for your parent plants",
      selectSpecificPlants:
        "Now, select specific plants from your chosen categories",
      firstParentCategory: "First Parent Plant Category:",
      secondParentCategory: "Second Parent Plant Category:",
      firstParentPlant: "First Parent Plant:",
      secondParentPlant: "Second Parent Plant:",
      continueToSelection: "Continue",
      reset: "Reset",
      crossBreed: "Cross Breed",
      changeCategories: "Change Categories",
      selectedPlants: "Selected Plants",
      breedingResult: "Cross-Breeding Result",
      category: "Category",
      water: "Water needs",
      sunlight: "Sunlight",
      successRate: "Success Rate",
      selectCategory: "Select a category",
      selectPlant: "Select a plant",
    },
    ur: {
      selectCategories: "زمرہ منتخب کریں",
      selectPlants: "پودے منتخب کریں",
      viewResult: "نتیجہ دیکھیں",
      selectPlantCategories: "پودوں کے زمرے منتخب کریں",
      selectParentPlants: "والدین پودے منتخب کریں",
      chooseCategories: "سب سے پہلے، اپنے والدین پودوں کے لئے زمرے منتخب کریں",
      selectSpecificPlants:
        "اب، اپنے منتخب کردہ زمروں سے مخصوص پودے منتخب کریں",
      firstParentCategory: "پہلا والدین پودا زمرہ:",
      secondParentCategory: "دوسرا والدین پودا زمرہ:",
      firstParentPlant: "پہلا والدین پودا:",
      secondParentPlant: "دوسرا والدین پودا:",
      continueToSelection: "جاری رکھیں",
      reset: "دوبارہ ترتیب دیں",
      crossBreed: "کراس بریڈ کریں",
      changeCategories: "زمرہ تبدیل کریں",
      selectedPlants: "منتخب کردہ پودے",
      breedingResult: "کراس بریڈنگ کا نتیجہ",
      category: "زمرہ",
      water: "پانی کی ضرورت",
      sunlight: "دھوپ",
      successRate: "کامیابی کی شرح",
      selectCategory: "زمرہ منتخب کریں",
      selectPlant: "پودا منتخب کریں",
    },
  };

  const t = translations[language];

  return (
    <div className="cross-breed-tool">
      <div className="selection-container">
        {/* Show saved results button if there are saved results */}
        {savedResults.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button
              onClick={() => setShowSavedResultsModal(true)}
              className="view-saved-results-btn"
              style={{
                background: "linear-gradient(135deg, #1a4d2e 0%, #2d5f3e 100%)",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(26, 77, 46, 0.3)",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #2d5f3e 0%, #3d6f4e 100%)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(26, 77, 46, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #1a4d2e 0%, #2d5f3e 100%)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(26, 77, 46, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📚</span>
              <span>View Saved Results ({savedResults.length})</span>
            </button>
          </div>
        )}

        {/* Error Message - Positioned prominently at the top */}
        {error && (
          <div className="error-message-top">
            <strong>
              ⚠️{" "}
              {error.includes("compatible") ? "Incompatible Plants:" : "Error:"}
            </strong>{" "}
            {error}
          </div>
        )}

        {/* Step indicator */}
        <div className={`step-indicator ${language === "ur" ? "rtl" : ""}`}>
          <div className={`step ${step === 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">{t.selectCategories}</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step === 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">{t.selectPlants}</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${result ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">{t.viewResult}</span>
          </div>
        </div>

        <div className="plant-selection">
          {step === 1 ? (
            <>
              <h2>{t.selectPlantCategories}</h2>
              <p className="selection-instruction">{t.chooseCategories}</p>
              <div className="selection-form category-selection">
                <div className="form-group">
                  <label>{t.firstParentCategory}</label>
                  <select
                    value={selectedCategory1}
                    onChange={handleCategory1Change}
                    className="select-input"
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map((category) => (
                      <option key={`cat1-${category}`} value={category}>
                        {category}s
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{t.secondParentCategory}</label>
                  <select
                    value={selectedCategory2}
                    onChange={handleCategory2Change}
                    className="select-input"
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map((category) => (
                      <option key={`cat2-${category}`} value={category}>
                        {category}s
                      </option>
                    ))}
                  </select>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleContinueToPlantSelection}
                    className="continue-button"
                    disabled={!selectedCategory1 || !selectedCategory2}
                  >
                    {t.continueToSelection}
                  </button>
                  <button onClick={handleReset} className="reset-button">
                    {t.reset}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2>{t.selectParentPlants}</h2>
              <p className="selection-instruction">{t.selectSpecificPlants}</p>
              <div className="selection-categories">
                <div className="selected-category">
                  <span>{t.firstParentCategory.replace(":", "")}</span>
                  <span className={`category-badge ${selectedCategory1}`}>
                    {selectedCategory1}s
                  </span>
                </div>
                <div className="selected-category">
                  <span>{t.secondParentCategory.replace(":", "")}</span>
                  <span className={`category-badge ${selectedCategory2}`}>
                    {selectedCategory2}s
                  </span>
                </div>
                <button
                  onClick={handleBackToCategorySelection}
                  className="change-category-button"
                >
                  {t.changeCategories}
                </button>
              </div>

              <div className="selection-form plant-selection-form">
                <div className="plant-selection-groups">
                  <div className="form-group">
                    <label>{t.firstParentPlant}</label>
                    <select
                      value={plant1?.id || ""}
                      onChange={handlePlant1Change}
                      className="select-input"
                    >
                      <option value="">{t.selectPlant}</option>
                      {plantData
                        .filter((plant) => plant.category === selectedCategory1)
                        .map((plant) => (
                          <option key={plant.id} value={plant.id}>
                            {plant.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t.secondParentPlant}</label>
                    <select
                      value={plant2?.id || ""}
                      onChange={handlePlant2Change}
                      className="select-input"
                    >
                      <option value="">{t.selectPlant}</option>
                      {plantData
                        .filter((plant) => plant.category === selectedCategory2)
                        .map((plant) => (
                          <option key={plant.id} value={plant.id}>
                            {plant.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleCrossBreed}
                    className="breed-button"
                    disabled={!plant1 || !plant2}
                  >
                    {t.crossBreed}
                  </button>
                  <button onClick={handleReset} className="reset-button">
                    {t.reset}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Selected Plants Display */}
        {(plant1 || plant2) && (
          <div className={`selected-plants ${language === "ur" ? "rtl" : ""}`}>
            <h3 className="section-heading">{t.selectedPlants}</h3>
            <div className="plants-container">
              {plant1 && (
                <div className="plant-card">
                  <div className={`category-badge ${plant1.category}`}>
                    {plant1.category}
                  </div>
                  <h4>{plant1.name}</h4>
                  <p>
                    <strong>{t.water}:</strong> {plant1.water}
                  </p>
                  <p>
                    <strong>{t.sunlight}:</strong> {plant1.sunlight}
                  </p>
                  <p className="plant-description">{plant1.description}</p>
                </div>
              )}

              {plant2 && (
                <div className="plant-card">
                  <div className={`category-badge ${plant2.category}`}>
                    {plant2.category}
                  </div>
                  <h4>{plant2.name}</h4>
                  <p>
                    <strong>{t.water}:</strong> {plant2.water}
                  </p>
                  <p>
                    <strong>{t.sunlight}:</strong> {plant2.sunlight}
                  </p>
                  <p className="plant-description">{plant2.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`result-container ${language === "ur" ? "rtl" : ""}`}>
            <h3 className="section-heading">{t.breedingResult}</h3>
            <div className="hybrid-card">
              <h4>{result.name}</h4>
              <div className="hybrid-details">
                <p>
                  <strong>{t.category}:</strong> {result.category}
                </p>
                <p>
                  <strong>{t.water}:</strong> {result.water}
                </p>
                <p>
                  <strong>{t.sunlight}:</strong> {result.sunlight}
                </p>
                <p>
                  <strong>{t.successRate}:</strong> {result.successRate}%
                </p>
                <p>{result.description}</p>
              </div>
              <div className="success-meter">
                <div
                  className="success-fill"
                  style={{ width: `${result.successRate}%` }}
                ></div>
              </div>

              {/* Save Result Button */}
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  onClick={saveCurrentResult}
                  disabled={isSaving}
                  style={{
                    background: isSaving
                      ? "#ccc"
                      : "linear-gradient(135deg, #0f2d1a 0%, #1a4d2e 100%)",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(15, 45, 26, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isSaving ? "💾 Saving..." : "💾 Save This Result"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Results Modal */}
      {showSavedResultsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSavedResultsModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <h2 style={{ color: "#0f2d1a", margin: 0 }}>
                📚 My Saved Cross-Breeding Results
              </h2>
              <button
                onClick={() => setShowSavedResultsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "2rem",
                  color: "#666",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {savedResults.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "2rem",
                  }}
                >
                  No saved results yet. Start cross-breeding and save your
                  results!
                </p>
              ) : (
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {savedResults.map((savedResult) => (
                    <div
                      key={savedResult.id}
                      style={{
                        background:
                          "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                        border: "3px solid #4caf50",
                        borderRadius: "12px",
                        padding: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          background: "white",
                          padding: "1.5rem",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            marginBottom: "1rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#0f2d1a",
                              margin: 0,
                              fontSize: "1.5rem",
                            }}
                          >
                            {savedResult.hybridName}
                          </h4>
                          <button
                            onClick={() => deleteSavedResult(savedResult.id)}
                            style={{
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>

                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.9rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <strong>Parents:</strong> {savedResult.parent1} ×{" "}
                          {savedResult.parent2}
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "0.8rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <p
                            style={{
                              background: "#f9f9f9",
                              padding: "0.8rem",
                              borderRadius: "8px",
                              borderLeft: "3px solid #4caf50",
                              margin: 0,
                            }}
                          >
                            <strong>Category:</strong> {savedResult.category}
                          </p>
                          <p
                            style={{
                              background: "#f9f9f9",
                              padding: "0.8rem",
                              borderRadius: "8px",
                              borderLeft: "3px solid #4caf50",
                              margin: 0,
                            }}
                          >
                            <strong>Water:</strong> {savedResult.water}
                          </p>
                          <p
                            style={{
                              background: "#f9f9f9",
                              padding: "0.8rem",
                              borderRadius: "8px",
                              borderLeft: "3px solid #4caf50",
                              margin: 0,
                            }}
                          >
                            <strong>Sunlight:</strong> {savedResult.sunlight}
                          </p>
                          <p
                            style={{
                              background: "#f9f9f9",
                              padding: "0.8rem",
                              borderRadius: "8px",
                              borderLeft: "3px solid #4caf50",
                              margin: 0,
                            }}
                          >
                            <strong>Success Rate:</strong>{" "}
                            {savedResult.successRate}%
                          </p>
                        </div>

                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.9rem",
                            marginBottom: "1rem",
                          }}
                        >
                          {savedResult.description}
                        </p>

                        <div
                          style={{
                            width: "100%",
                            height: "30px",
                            background: "#e0e0e0",
                            borderRadius: "15px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${savedResult.successRate}%`,
                              background:
                                "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
                              borderRadius: "15px",
                              transition: "width 1s ease",
                            }}
                          ></div>
                        </div>

                        <p
                          style={{
                            color: "#999",
                            fontSize: "0.8rem",
                            marginTop: "1rem",
                            textAlign: "right",
                          }}
                        >
                          Saved on:{" "}
                          {new Date(
                            savedResult.createdAt?.seconds * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossBreedTool;
