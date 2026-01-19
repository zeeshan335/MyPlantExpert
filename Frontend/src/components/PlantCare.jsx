import "./PlantCare.css";
import React, { useState } from "react";
// Import the new styles

// Plant database for recommendations - expanded for all combinations
const plants = [
  // 🌿 Indoor Plants - Low Light
  {
    name: "Snake Plant",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Rarely",
    experience: "Beginner",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "ZZ Plant",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Rarely",
    experience: "Beginner",
    purposes: ["Decorative", "Air Purifying"],
  },
  {
    name: "Chinese Evergreen",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Decorative", "Air Purifying"],
  },
  {
    name: "Pothos",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Calathea",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Daily",
    experience: "Intermediate",
    purposes: ["Decorative"],
  },
  {
    name: "Fittonia (Nerve Plant)",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Daily",
    experience: "Beginner",
    purposes: ["Decorative"],
  },

  // 🌿 Indoor Plants - Medium Light
  {
    name: "Peace Lily",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Regularly",
    experience: "Intermediate",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Philodendron",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Spider Plant",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Boston Fern",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Daily",
    experience: "Intermediate",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Maidenhair Fern",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Daily",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "String of Pearls",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Rarely",
    experience: "Intermediate",
    purposes: ["Decorative"],
  },
  {
    name: "Maranta (Prayer Plant)",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Regularly",
    experience: "Intermediate",
    purposes: ["Decorative"],
  },
  {
    name: "Cast Iron Plant",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Rarely",
    experience: "Beginner",
    purposes: ["Decorative"],
  },

  // 🌿 Indoor Plants - Bright Light
  {
    name: "Aloe Vera",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Rarely",
    experience: "Beginner",
    purposes: ["Medicinal", "Decorative"],
  },
  {
    name: "Jade Plant",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Rarely",
    experience: "Beginner",
    purposes: ["Decorative"],
  },
  {
    name: "Fiddle Leaf Fig",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Regularly",
    experience: "Intermediate",
    purposes: ["Decorative"],
  },
  {
    name: "Rubber Plant",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Lemon Tree",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Regularly",
    experience: "Intermediate",
    purposes: ["Edible", "Decorative"],
  },
  {
    name: "Basil",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Daily",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Mint",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Daily",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Rosemary",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Rarely",
    experience: "Intermediate",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Lavender",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Rarely",
    experience: "Intermediate",
    purposes: ["Medicinal", "Decorative"],
  },

  // 🌳 Outdoor Plants - Balcony
  {
    name: "Cherry Tomatoes",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Full sun",
    waterAvailability: "Plenty",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Tulsi (Holy Basil)",
    type: "Outdoor",
    space: ["Balcony", "Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Plenty",
    experience: "Intermediate",
    purposes: ["Medicinal", "Edible"],
  },
  {
    name: "Chili Peppers",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Dwarf Sunflowers",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Aesthetic", "Environmental"],
  },
  {
    name: "Petunias",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Partial sun",
    waterAvailability: "Plenty",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },
  {
    name: "Impatiens",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Mostly shade",
    waterAvailability: "Plenty",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },
  {
    name: "Coleus",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Mostly shade",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },
  {
    name: "Mint (Pudina)",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Partial sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Caladium",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Mostly shade",
    waterAvailability: "Plenty",
    experience: "Intermediate",
    purposes: ["Aesthetic"],
  },
  {
    name: "Ferns",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Mostly shade",
    waterAvailability: "Rainwater only",
    experience: "Intermediate",
    purposes: ["Aesthetic", "Environmental"],
  },
  {
    name: "Begonias",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Partial sun",
    waterAvailability: "Rainwater only",
    experience: "Intermediate",
    purposes: ["Aesthetic"],
  },
  {
    name: "Cactus Garden",
    type: "Outdoor",
    space: ["Balcony"],
    sunlight: "Full sun",
    waterAvailability: "Rainwater only",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },

  // 🌳 Outdoor Plants - Garden Bed
  {
    name: "Rose Bush",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Plenty",
    experience: "Intermediate",
    purposes: ["Aesthetic", "Medicinal"],
  },
  {
    name: "Cucumber",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Plenty",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Marigold",
    type: "Outdoor",
    space: ["Garden bed", "Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Aesthetic", "Environmental"],
  },
  {
    name: "Eggplant (Brinjal)",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Intermediate",
    purposes: ["Edible"],
  },
  {
    name: "Okra (Lady's Finger)",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Spinach (Palak)",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Partial sun",
    waterAvailability: "Plenty",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Fenugreek (Methi)",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Partial sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Hostas",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Mostly shade",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },
  {
    name: "Ashwagandha",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Rainwater only",
    experience: "Intermediate",
    purposes: ["Medicinal"],
  },
  {
    name: "Turmeric",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Partial sun",
    waterAvailability: "Rainwater only",
    experience: "Intermediate",
    purposes: ["Medicinal", "Edible"],
  },
  {
    name: "Ginger",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Mostly shade",
    waterAvailability: "Rainwater only",
    experience: "Intermediate",
    purposes: ["Medicinal", "Edible"],
  },

  // 🌳 Outdoor Plants - Rooftop
  {
    name: "Bougainvillea",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Intermediate",
    purposes: ["Aesthetic"],
  },
  {
    name: "Jade Plant",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Rainwater only",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },
  {
    name: "Cherry Tomatoes",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Plenty",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Bell Peppers",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Plenty",
    experience: "Intermediate",
    purposes: ["Edible"],
  },
  {
    name: "Curry Leaf Plant",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Plenty",
    experience: "Intermediate",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Lemongrass",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Cosmos",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Rainwater only",
    experience: "Beginner",
    purposes: ["Aesthetic", "Environmental"],
  },
  {
    name: "Portulaca",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Rainwater only",
    experience: "Beginner",
    purposes: ["Aesthetic"],
  },
  {
    name: "Zinnias",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Aesthetic", "Environmental"],
  },
  {
    name: "Spider Plant",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Rainwater only",
    experience: "Beginner",
    purposes: ["Aesthetic", "Environmental"],
  },
  {
    name: "Patchouli",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Limited",
    experience: "Intermediate",
    purposes: ["Medicinal"],
  },
  {
    name: "Oregano",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Thyme",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Rainwater only",
    experience: "Beginner",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Sage",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Rainwater only",
    experience: "Intermediate",
    purposes: ["Edible", "Medicinal"],
  },
  {
    name: "Ajwain (Carom)",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Intermediate",
    purposes: ["Edible", "Medicinal"],
  },
];

// Add these additional plants to cover all possible combinations
const additionalPlants = [
  // Add indoor expert plants for all light conditions and purposes
  {
    name: "Orchid",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Regularly",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "Bonsai Tree",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Regularly",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "Venus Fly Trap",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Regularly",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "Calathea Orbifolia",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Regularly",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "Alocasia Polly",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Daily",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "Rare Philodendron Collection",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Rarely",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  {
    name: "Medicinal Herbs Collection",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Daily",
    experience: "Expert",
    purposes: ["Medicinal"],
  },
  {
    name: "Indoor Pepper Varieties",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Daily",
    experience: "Expert",
    purposes: ["Edible"],
  },
  {
    name: "Microgreens Setup",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Daily",
    experience: "Expert",
    purposes: ["Edible"],
  },
  {
    name: "Air Plant Display",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Rarely",
    experience: "Expert",
    purposes: ["Air Purifying", "Decorative"],
  },
  {
    name: "Streptocarpus",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Regularly",
    experience: "Expert",
    purposes: ["Decorative"],
  },
  // Add more indoor combinations
  {
    name: "Stevia Plant",
    type: "Indoor",
    sunlight: "Bright direct sunlight",
    watering: "Regularly",
    experience: "Intermediate",
    purposes: ["Edible"],
  },
  {
    name: "Indoor Mint",
    type: "Indoor",
    sunlight: "Medium light",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Edible"],
  },
  {
    name: "Lemon Balm",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Regularly",
    experience: "Beginner",
    purposes: ["Medicinal", "Edible"],
  },
  {
    name: "Spider Plant",
    type: "Indoor",
    sunlight: "Low light",
    watering: "Rarely",
    experience: "Beginner",
    purposes: ["Air Purifying"],
  },
  // Add more outdoor combinations
  {
    name: "Passion Flower",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Mostly shade",
    waterAvailability: "Rainwater only",
    experience: "Expert",
    purposes: ["Medicinal", "Aesthetic"],
  },
  {
    name: "Nasturtium",
    type: "Outdoor",
    space: ["Balcony", "Garden bed", "Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Limited",
    experience: "Beginner",
    purposes: ["Edible", "Aesthetic"],
  },
  {
    name: "Butterfly Bush",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Full sun",
    waterAvailability: "Limited",
    experience: "Expert",
    purposes: ["Environmental"],
  },
  {
    name: "Lady Fern",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Mostly shade",
    waterAvailability: "Plenty",
    experience: "Expert",
    purposes: ["Aesthetic"],
  },
  {
    name: "Rain Garden Mix",
    type: "Outdoor",
    space: ["Garden bed"],
    sunlight: "Partial sun",
    waterAvailability: "Plenty",
    experience: "Expert",
    purposes: ["Environmental"],
  },
  {
    name: "Pitcher Plant",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Mostly shade",
    waterAvailability: "Plenty",
    experience: "Expert",
    purposes: ["Environmental"],
  },
  {
    name: "Bamboo Screen",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Partial sun",
    waterAvailability: "Plenty",
    experience: "Expert",
    purposes: ["Aesthetic"],
  },
  {
    name: "Medicinal Herb Garden",
    type: "Outdoor",
    space: ["Rooftop"],
    sunlight: "Mostly shade",
    waterAvailability: "Limited",
    experience: "Expert",
    purposes: ["Medicinal"],
  },
];

// Add the additional plants to the main plants array
const allPlants = [...plants, ...additionalPlants];

function PlantCare() {
  // Questionnaire state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    type: "",
    sunlight: "",
    watering: "",
    space: "",
    waterAvailability: "",
    purpose: "",
    experience: "",
  });
  const [recommendations, setRecommendations] = useState([]);

  // Add state for favorites
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on component mount
    const savedFavorites = localStorage.getItem("favoritePlants");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  // Add state for planted plants
  const [plantedPlants, setPlantedPlants] = useState(() => {
    // Load planted plants from localStorage
    const savedPlants = localStorage.getItem("plantedPlants");
    return savedPlants ? JSON.parse(savedPlants) : [];
  });

  // Add state for active tab
  const [activeTab, setActiveTab] = useState("recommendations");

  // Add a plant to favorites
  const addToFavorites = (plant) => {
    // Check if plant is already in favorites to avoid duplicates
    if (!favorites.some((fav) => fav.name === plant.name)) {
      const updatedFavorites = [...favorites, plant];
      setFavorites(updatedFavorites);
      // Save to localStorage
      localStorage.setItem("favoritePlants", JSON.stringify(updatedFavorites));
    }
  };

  // Remove a plant from favorites
  const removeFromFavorite = (plantName) => {
    const updatedFavorites = favorites.filter(
      (plant) => plant.name !== plantName
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favoritePlants", JSON.stringify(updatedFavorites));
  };

  // Check if a plant is in favorites
  const isInFavorites = (plantName) => {
    return favorites.some((plant) => plant.name === plantName);
  };

  // Function to select a plant for planting
  const selectPlantForPlanting = (plant) => {
    // Add care schedule based on plant type
    const plantWithCare = {
      ...plant,
      plantedDate: new Date().toISOString(),
      careSchedule: generateCareSchedule(plant),
    };

    const updatedPlantedPlants = [...plantedPlants, plantWithCare];
    setPlantedPlants(updatedPlantedPlants);
    localStorage.setItem("plantedPlants", JSON.stringify(updatedPlantedPlants));
  };

  // Function to remove a planted plant
  const removePlantedPlant = (index) => {
    const updatedPlants = [...plantedPlants];
    updatedPlants.splice(index, 1);
    setPlantedPlants(updatedPlants);
    localStorage.setItem("plantedPlants", JSON.stringify(updatedPlants));
  };

  // Function to generate care schedule based on plant type
  const generateCareSchedule = (plant) => {
    const today = new Date();
    const wateringSchedule = [];
    const fertilizerSchedule = [];

    // Generate watering schedule based on plant needs
    let wateringFrequency = 7; // Default 7 days

    if (plant.type === "Indoor") {
      if (plant.watering === "Daily") {
        wateringFrequency = 1;
      } else if (plant.watering === "Regularly") {
        wateringFrequency = 3;
      } else if (plant.watering === "Rarely") {
        wateringFrequency = 7;
      }
    } else {
      if (plant.waterAvailability === "Plenty") {
        wateringFrequency = 2;
      } else if (plant.waterAvailability === "Limited") {
        wateringFrequency = 4;
      } else if (plant.waterAvailability === "Rainwater only") {
        wateringFrequency = 7;
      }
    }

    // Create 4 watering dates
    for (let i = 1; i <= 4; i++) {
      const waterDate = new Date(today);
      waterDate.setDate(today.getDate() + wateringFrequency * i);
      wateringSchedule.push({
        date: waterDate.toISOString(),
        completed: false,
      });
    }

    // Create 2 fertilizer dates (monthly)
    for (let i = 1; i <= 2; i++) {
      const fertDate = new Date(today);
      fertDate.setMonth(today.getMonth() + i);
      fertilizerSchedule.push({
        date: fertDate.toISOString(),
        completed: false,
      });
    }

    return {
      watering: wateringSchedule,
      fertilizer: fertilizerSchedule,
    };
  };

  // Function to mark care task as completed
  const markTaskComplete = (plantIndex, taskType, taskIndex) => {
    const updatedPlants = [...plantedPlants];
    updatedPlants[plantIndex].careSchedule[taskType][taskIndex].completed =
      !updatedPlants[plantIndex].careSchedule[taskType][taskIndex].completed;

    setPlantedPlants(updatedPlants);
    localStorage.setItem("plantedPlants", JSON.stringify(updatedPlants));
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle answer selection in questionnaire
  const handleSelectAnswer = (answer) => {
    const newAnswers = { ...answers };

    switch (currentStep) {
      case 0:
        newAnswers.type = answer;
        break;
      case 1:
        if (answers.type === "Indoor") {
          newAnswers.sunlight = answer;
        } else {
          newAnswers.space = answer;
        }
        break;
      case 2:
        if (answers.type === "Indoor") {
          newAnswers.watering = answer;
        } else {
          newAnswers.waterAvailability = answer;
        }
        break;
      case 3:
        if (answers.type === "Indoor") {
          newAnswers.purpose = answer;
        } else {
          newAnswers.sunlight = answer;
        }
        break;
      case 4:
        if (answers.type === "Indoor") {
          newAnswers.experience = answer;
        } else {
          newAnswers.purpose = answer;
        }
        break;
      case 5:
        if (answers.type === "Outdoor") {
          newAnswers.experience = answer;
        }
        break;
    }

    setAnswers(newAnswers);

    // Determine if we should go to next step or show results
    const isLastStep =
      (answers.type === "Indoor" && currentStep === 4) ||
      (answers.type === "Outdoor" && currentStep === 5);

    if (isLastStep) {
      processRecommendations(newAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Process the answers to generate recommendations
  const processRecommendations = (userAnswers) => {
    // Filter plants based on answers
    let filteredPlants = allPlants.filter((plant) => {
      // Basic type match
      if (plant.type !== userAnswers.type) return false;

      if (userAnswers.type === "Indoor") {
        // Indoor plant filters
        if (plant.sunlight !== userAnswers.sunlight) return false;
        if (plant.watering !== userAnswers.watering) return false;
        if (plant.experience !== userAnswers.experience) return false;
        if (!plant.purposes.includes(userAnswers.purpose)) return false;
      } else {
        // Outdoor plant filters
        if (!plant.space.includes(userAnswers.space)) return false;
        if (plant.sunlight !== userAnswers.sunlight) return false;
        if (plant.waterAvailability !== userAnswers.waterAvailability)
          return false;
        if (plant.experience !== userAnswers.experience) return false;
        if (!plant.purposes.includes(userAnswers.purpose)) return false;
      }

      return true;
    });

    // If no plants found, try more flexible matching
    if (filteredPlants.length === 0) {
      filteredPlants = allPlants.filter((plant) => {
        // Only match type and primary criteria
        if (plant.type !== userAnswers.type) return false;

        if (userAnswers.type === "Indoor") {
          // More flexible indoor matching
          if (plant.sunlight !== userAnswers.sunlight) return false;
          if (plant.experience !== userAnswers.experience) return false;
          return true; // Be more flexible with other criteria
        } else {
          // More flexible outdoor matching
          if (!plant.space.includes(userAnswers.space)) return false;
          if (plant.experience !== userAnswers.experience) return false;
          return true; // Be more flexible with other criteria
        }
      });
    }

    setRecommendations(filteredPlants);
    setCurrentStep(currentStep + 1); // Move to results view
  };

  // Reset the questionnaire
  const resetQuestionnaire = () => {
    setCurrentStep(0);
    setAnswers({
      type: "",
      sunlight: "",
      watering: "",
      space: "",
      waterAvailability: "",
      purpose: "",
      experience: "",
    });
    setRecommendations([]);
  };

  // Get current question and options based on step
  const getCurrentQuestion = () => {
    if (answers.type === "Indoor") {
      // Indoor questions sequence
      switch (currentStep) {
        case 0:
          return {
            question: "Where do you want to grow the plant?",
            options: ["Indoor", "Outdoor"],
          };
        case 1:
          return {
            question: "How much sunlight is available?",
            options: ["Low light", "Medium light", "Bright direct sunlight"],
          };
        case 2:
          return {
            question: "How often can you water the plant?",
            options: ["Rarely", "Regularly", "Daily"],
          };
        case 3:
          return {
            question: "What's your purpose?",
            options: ["Decorative", "Air Purifying", "Edible", "Medicinal"],
          };
        case 4:
          return {
            question: "Your experience level?",
            options: ["Beginner", "Intermediate", "Expert"],
          };
        default:
          return { question: "", options: [] };
      }
    } else if (answers.type === "Outdoor") {
      // Outdoor questions sequence
      switch (currentStep) {
        case 0:
          return {
            question: "Where do you want to grow the plant?",
            options: ["Indoor", "Outdoor"],
          };
        case 1:
          return {
            question: "What kind of outdoor space do you have?",
            options: ["Balcony", "Garden bed", "Rooftop"],
          };
        case 2:
          return {
            question: "How much water is available?",
            options: ["Plenty", "Limited", "Rainwater only"],
          };
        case 3:
          return {
            question: "How sunny is the space?",
            options: ["Full sun", "Partial sun", "Mostly shade"],
          };
        case 4:
          return {
            question: "Purpose of planting?",
            options: ["Aesthetic", "Edible", "Medicinal", "Environmental"],
          };
        case 5:
          return {
            question: "Your gardening experience?",
            options: ["Beginner", "Intermediate", "Expert"],
          };
        default:
          return { question: "", options: [] };
      }
    } else {
      // Initial question
      return {
        question: "Where do you want to grow the plant?",
        options: ["Indoor", "Outdoor"],
      };
    }
  };

  const renderPlantedView = () => {
    return (
      <div className="planted-container">
        <h3 className="section-title">Your Garden</h3>

        {plantedPlants.length === 0 ? (
          <div className="no-results">
            <div className="icon">🌱</div>
            <p>You haven't added any plants to your garden yet.</p>
            <p>Select plants from recommendations to start growing!</p>
          </div>
        ) : (
          <div className="recommendation-results">
            {plantedPlants.map((plant, plantIndex) => (
              <div key={plantIndex} className="plant-card planted-card">
                <h3 className="plant-name">{plant.name}</h3>
                <div className="plant-details">
                  <p>
                    <span>Type:</span> {plant.type}
                  </p>
                  <p>
                    <span>Planted on:</span> {formatDate(plant.plantedDate)}
                  </p>
                </div>

                <div className="care-calendar">
                  <h4>Care Schedule</h4>

                  <h5>Watering</h5>
                  {plant.careSchedule.watering.map((water, idx) => (
                    <div
                      key={`water-${idx}`}
                      className={`care-item ${
                        water.completed ? "completed-task" : ""
                      }`}
                    >
                      <span className="care-action">Water plant</span>
                      <span className="reminder-date">
                        {formatDate(water.date)}
                        <button
                          className="care-complete"
                          onClick={() =>
                            markTaskComplete(plantIndex, "watering", idx)
                          }
                          aria-label="Mark as completed"
                        >
                          {water.completed ? "✓" : "○"}
                        </button>
                      </span>
                    </div>
                  ))}

                  <h5>Fertilizing</h5>
                  {plant.careSchedule.fertilizer.map((fert, idx) => (
                    <div
                      key={`fert-${idx}`}
                      className={`care-item ${
                        fert.completed ? "completed-task" : ""
                      }`}
                    >
                      <span className="care-action">Fertilize plant</span>
                      <span className="reminder-date">
                        {formatDate(fert.date)}
                        <button
                          className="care-complete"
                          onClick={() =>
                            markTaskComplete(plantIndex, "fertilizer", idx)
                          }
                          aria-label="Mark as completed"
                        >
                          {fert.completed ? "✓" : "○"}
                        </button>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="action-buttons">
                  <button
                    className={
                      isInFavorites(plant.name)
                        ? "remove-favorite-button"
                        : "add-favorite-button"
                    }
                    onClick={() =>
                      isInFavorites(plant.name)
                        ? removeFromFavorite(plant.name)
                        : addToFavorites(plant)
                    }
                  >
                    {isInFavorites(plant.name)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </button>

                  <button
                    className="remove-garden-button"
                    onClick={() => removePlantedPlant(plantIndex)}
                  >
                    Remove from Garden
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="button-group">
          <button
            onClick={() => setActiveTab("recommendations")}
            className="primary-button"
          >
            Back to Recommendations
          </button>
        </div>
      </div>
    );
  };

  // Handle initial quiz start
  const startQuiz = () => {
    setAnswers({
      type: "",
      sunlight: "",
      watering: "",
      space: "",
      waterAvailability: "",
      purpose: "",
      experience: "",
    });
    setCurrentStep(0);
  };

  const renderQuestionnaire = () => {
    // Show planted plants view if active tab is 'planted'
    if (activeTab === "planted") {
      return renderPlantedView();
    }

    // Show favorites view
    if (showFavorites) {
      return (
        <div className="favorites-container">
          <h3 className="section-title">Your Favorite Plants</h3>

          {favorites.length === 0 ? (
            <div className="no-results">
              <div className="icon">💔</div>
              <p>You haven't added any plants to your favorites yet.</p>
            </div>
          ) : (
            <div className="recommendation-results">
              {favorites.map((plant, index) => (
                <div key={index} className="plant-card favorite-card">
                  <h3 className="plant-name">{plant.name}</h3>
                  <div className="plant-details">
                    <p>
                      <span>Type:</span> {plant.type}
                    </p>
                    <p>
                      <span>Light Needs:</span> {plant.sunlight}
                    </p>
                    <p>
                      <span>Water Needs:</span>{" "}
                      {plant.type === "Indoor"
                        ? plant.watering
                        : plant.waterAvailability}
                    </p>
                    <p>
                      <span>Suitable for:</span>{" "}
                      {plant.type === "Indoor"
                        ? "Indoor spaces"
                        : plant.space.join(", ")}
                    </p>
                    <p>
                      <span>Purposes:</span> {plant.purposes.join(", ")}
                    </p>
                    <p>
                      <span>Experience Level:</span> {plant.experience}
                    </p>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="remove-favorite-button"
                      onClick={() => removeFromFavorite(plant.name)}
                    >
                      Remove from Favorites
                    </button>

                    <button
                      className="select-plant-button"
                      onClick={() => selectPlantForPlanting(plant)}
                    >
                      Select for Planting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="button-group">
            <button
              onClick={() => setShowFavorites(false)}
              className="primary-button"
            >
              Back to Recommendations
            </button>
          </div>
        </div>
      );
    }

    // Results screen after all questions
    if (
      (answers.type === "Indoor" && currentStep > 4) ||
      (answers.type === "Outdoor" && currentStep > 5)
    ) {
      return (
        <div className="results-container">
          <h3 className="section-title">Recommended Plants for You</h3>

          {recommendations.length === 0 ? (
            <div className="no-results">
              <div className="icon">🌱</div>
              <p>Based on your preferences, we couldn't find an exact match.</p>
              <p>Consider adjusting your criteria.</p>
            </div>
          ) : (
            <div className="recommendation-results">
              {recommendations.map((plant, index) => (
                <div key={index} className="plant-card">
                  <h3 className="plant-name">{plant.name}</h3>
                  <div className="plant-details">
                    <p>
                      <span>Type:</span> {plant.type}
                    </p>
                    <p>
                      <span>Light Needs:</span> {plant.sunlight}
                    </p>
                    <p>
                      <span>Water Needs:</span>{" "}
                      {plant.type === "Indoor"
                        ? plant.watering
                        : plant.waterAvailability}
                    </p>
                    <p>
                      <span>Suitable for:</span>{" "}
                      {plant.type === "Indoor"
                        ? "Indoor spaces"
                        : plant.space.join(", ")}
                    </p>
                    <p>
                      <span>Purposes:</span> {plant.purposes.join(", ")}
                    </p>
                    <p>
                      <span>Experience Level:</span> {plant.experience}
                    </p>
                  </div>

                  <div className="action-buttons">
                    <button
                      className={
                        isInFavorites(plant.name)
                          ? "remove-favorite-button"
                          : "add-favorite-button"
                      }
                      onClick={() =>
                        isInFavorites(plant.name)
                          ? removeFromFavorite(plant.name)
                          : addToFavorites(plant)
                      }
                    >
                      {isInFavorites(plant.name)
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </button>

                    <button
                      className="select-plant-button"
                      onClick={() => selectPlantForPlanting(plant)}
                    >
                      Select for Planting
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="button-group">
            <button onClick={resetQuestionnaire} className="primary-button">
              Start Over
            </button>
          </div>
        </div>
      );
    }

    // If we're at the start screen (no type selected and step 0)
    if (!answers.type && currentStep === 0) {
      return (
        <div className="start-screen">
          <div className="question-container" style={{ marginBottom: "30px" }}>
            <h3
              className="question-text"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "1.2rem",
                color: "#2e7d32",
                textShadow: "0px 1px 1px rgba(0,0,0,0.1)",
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              Plant Recommendations
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                marginBottom: "1.8rem",
                color: "#3a5a40",
                maxWidth: "550px",
                margin: "0 auto 1.8rem auto",
                lineHeight: "1.5",
                fontStyle: "italic",
                background: "rgba(236, 247, 238, 0.6)",
                padding: "10px 15px",
                borderRadius: "6px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              Find the perfect plants for your space and get personalized care
              advice
            </p>
            <div className="options-container">
              <button
                onClick={() => handleSelectAnswer("Indoor")}
                className="option-button"
              >
                Indoor Plants
              </button>
              <button
                onClick={() => handleSelectAnswer("Outdoor")}
                className="option-button"
              >
                Outdoor Plants
              </button>
            </div>
          </div>

          {/* Favorites and Garden sections only shown on initial screen */}
          <div className="overview-sections" style={{ marginTop: "40px" }}>
            {favorites.length > 0 && (
              <div className="overview-section favorite-overview">
                <h4>Your Favorite Plants ({favorites.length})</h4>
                <div className="mini-cards">
                  {favorites.slice(0, 3).map((plant, index) => (
                    <div key={index} className="mini-card">
                      <p>{plant.name}</p>
                    </div>
                  ))}
                  {favorites.length > 3 && (
                    <div className="mini-card more-card">
                      <p>+{favorites.length - 3} more</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowFavorites(true)}
                  className="view-all-button"
                >
                  View All Favorites
                </button>
              </div>
            )}

            {plantedPlants.length > 0 && (
              <div className="overview-section garden-overview">
                <h4>Your Garden ({plantedPlants.length})</h4>
                <div className="mini-cards">
                  {plantedPlants.slice(0, 3).map((plant, index) => (
                    <div key={index} className="mini-card">
                      <p>{plant.name}</p>
                    </div>
                  ))}
                  {plantedPlants.length > 3 && (
                    <div className="mini-card more-card">
                      <p>+{plantedPlants.length - 3} more</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("planted")}
                  className="view-all-button"
                >
                  View Garden Details
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Normal question screen
    const { question, options } = getCurrentQuestion();
    return (
      <div className="question-container">
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${
                (currentStep / (answers.type === "Indoor" ? 5 : 6)) * 100
              }%`,
            }}
          ></div>
        </div>

        <h3 className="question-text">{question}</h3>

        <div className="options-container">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectAnswer(option)}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="back-button"
          >
            ← Back
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="plant-care-content">
      <div className="header" style={{ marginBottom: "15px" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#388e3c",
            marginBottom: "0",
            fontFamily: "inherit",
            textAlign: "center",
            position: "relative",
            display: "inline-block",
            padding: "0.5rem 2rem",
          }}
        >
          Plant Care & Recommendations
        </h2>
      </div>

      {renderQuestionnaire()}
    </div>
  );
}

export default PlantCare;
