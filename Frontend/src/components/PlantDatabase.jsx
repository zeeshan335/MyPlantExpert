import React, { useState, useRef, useEffect } from "react";
import { FaHistory, FaSearch, FaTimes, FaLeaf, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./PlantDatabase.css";

// Add local plant data for popular regional plants
const popularPlantsData = [
  {
    id: "local-1",
    scientific_name: "Azadirachta indica",
    common_name: "Neem",
    urdu_name: "نیم",
    description: "A native tree with antifungal and antibacterial properties.",
    ideal_soil: "Well-drained, sandy soil",
    watering: "Twice a week",
    sunlight: "Full sun",
    uses: ["Medicinal", "Pesticide", "Shade"],
    region: "South Asia",
    family: "Meliaceae",
    genus: "Azadirachta",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Neem_tree.jpg/1200px-Neem_tree.jpg",
  },
  {
    id: "local-2",
    scientific_name: "Ocimum tenuiflorum",
    common_name: "Holy Basil",
    urdu_name: "تلسی",
    description:
      "Sacred plant in Hindu tradition with numerous medicinal properties.",
    ideal_soil: "Rich, well-draining soil",
    watering: "Regular watering",
    sunlight: "Partial to full sun",
    uses: ["Medicinal", "Religious", "Culinary"],
    region: "South Asia",
    family: "Lamiaceae",
    genus: "Ocimum",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ocimum_tenuiflorum_plant.jpg/1200px-Ocimum_tenuiflorum_plant.jpg",
  },
  {
    id: "local-3",
    scientific_name: "Rosa indica",
    common_name: "Rose",
    urdu_name: "گلاب",
    description:
      "Ornamental flowering plant beloved for its beauty and fragrance.",
    ideal_soil: "Rich loamy soil with good drainage",
    watering: "Regular, moderate watering",
    sunlight: "Full sun",
    uses: ["Ornamental", "Fragrance", "Medicinal"],
    region: "Widely cultivated in South Asia",
    family: "Rosaceae",
    genus: "Rosa",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rosa_rubiginosa_1.jpg/1200px-Rosa_rubiginosa_1.jpg",
  },
  {
    id: "local-4",
    scientific_name: "Aloe vera",
    common_name: "Aloe Vera",
    urdu_name: "ایلو ویرا",
    description:
      "Succulent plant species with medicinal properties, especially for skin conditions.",
    ideal_soil: "Sandy, well-draining soil",
    watering: "Infrequent, allow to dry between watering",
    sunlight: "Bright, indirect light",
    uses: ["Medicinal", "Cosmetic", "Ornamental"],
    region: "Naturalized in South Asia",
    family: "Asphodelaceae",
    genus: "Aloe",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aloe_vera_flower_inset.png/1200px-Aloe_vera_flower_inset.png",
  },
  {
    id: "local-5",
    scientific_name: "Mentha arvensis",
    common_name: "Mint",
    urdu_name: "پودینہ",
    description: "Aromatic herb used in cooking and traditional medicine.",
    ideal_soil: "Rich, moist soil",
    watering: "Frequent, keep soil moist",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal", "Aromatic"],
    region: "South Asia",
    family: "Lamiaceae",
    genus: "Mentha",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Mentha_arvensis_-_k%C3%B6hler%27s_medizinal-pflanzen-091.jpg/1200px-Mentha_arvensis_-_k%C3%B6hler%27s_medizinal-pflanzen-091.jpg",
  },
  {
    id: "local-6",
    scientific_name: "Curcuma longa",
    common_name: "Turmeric",
    urdu_name: "ہلدی",
    description:
      "Flowering plant in the ginger family, commonly used as a spice and for medicinal purposes.",
    ideal_soil: "Rich, loamy soil",
    watering: "Regular watering",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal", "Dye"],
    region: "South Asia",
    family: "Zingiberaceae",
    genus: "Curcuma",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Turmeric-powder.jpg/1200px-Turmeric-powder.jpg",
  },
  {
    id: "local-7",
    scientific_name: "Zingiber officinale",
    common_name: "Ginger",
    urdu_name: "ادرک",
    description:
      "Flowering plant whose rhizome is widely used as a spice and a folk medicine.",
    ideal_soil: "Rich, loamy soil with good drainage",
    watering: "Regular watering",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal"],
    region: "South Asia",
    family: "Zingiberaceae",
    genus: "Zingiber",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Starr_070906-8797_Zingiber_officinale.jpg/1200px-Starr_070906-8797_Zingiber_officinale.jpg",
  },
  {
    id: "local-8",
    scientific_name: "Ficus religiosa",
    common_name: "Peepal Tree",
    urdu_name: "پیپل",
    description:
      "Sacred fig tree with heart-shaped leaves, considered holy in South Asian cultures.",
    ideal_soil: "Well-draining soil",
    watering: "Moderate",
    sunlight: "Full sun to partial shade",
    uses: ["Religious", "Shade", "Medicinal"],
    region: "South Asia",
    family: "Moraceae",
    genus: "Ficus",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Sacred_fig_tree_Ficus_religiosa.jpg/1200px-Sacred_fig_tree_Ficus_religiosa.jpg",
  },
  {
    id: "local-9",
    scientific_name: "Musa paradisiaca",
    common_name: "Banana",
    urdu_name: "کیلا",
    description:
      "Large herbaceous flowering plant that produces the familiar curved fruits.",
    ideal_soil: "Rich, well-draining soil",
    watering: "Regular, high water requirement",
    sunlight: "Full sun",
    uses: ["Edible", "Fiber", "Ornamental"],
    region: "South and Southeast Asia",
    family: "Musaceae",
    genus: "Musa",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana_plantation_DRC.jpg/1200px-Banana_plantation_DRC.jpg",
  },
  {
    id: "local-10",
    scientific_name: "Mangifera indica",
    common_name: "Mango",
    urdu_name: "آم",
    description:
      "Tropical fruit-bearing tree, known as the 'King of Fruits' in South Asia.",
    ideal_soil: "Well-draining loamy soil",
    watering: "Regular when young, established trees are drought-tolerant",
    sunlight: "Full sun",
    uses: ["Edible", "Shade", "Timber"],
    region: "South Asia",
    family: "Anacardiaceae",
    genus: "Mangifera",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Mango_Tree%2C_Naranjo%2C_Alajuela%2C_Costa_Rica.jpg/1200px-Mango_Tree%2C_Naranjo%2C_Alajuela%2C_Costa_Rica.jpg",
  },
];

// Add authenticated plants data array right after popularPlantsData
const authenticatedPlantsData = [
  {
    id: "auth-1",
    scientific_name: "Ocimum tenuiflorum",
    common_name: "Holy Basil",
    urdu_name: "تُلسی",
    description:
      "An aromatic plant in the family Lamiaceae, revered for its medicinal and spiritual importance.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun to partial shade",
    uses: ["Medicinal", "Religious", "Tea"],
    region: "South Asia",
    family: "Lamiaceae",
    genus: "Ocimum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.5–1 meter",
  },
  {
    id: "auth-2",
    scientific_name: "Azadirachta indica",
    common_name: "Neem",
    urdu_name: "نِم",
    description:
      "A fast-growing tree known for its antibacterial and antifungal properties.",
    ideal_soil: "Well-drained sandy soil",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Medicinal", "Insecticide", "Skincare"],
    region: "Indian Subcontinent",
    family: "Meliaceae",
    genus: "Azadirachta",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Moderate to fast",
    max_height: "15–20 meters",
  },
  {
    id: "auth-3",
    scientific_name: "Curcuma longa",
    common_name: "Turmeric",
    urdu_name: "ہلدی",
    description:
      "Flowering plant in the ginger family, commonly used as a spice and for medicinal purposes.",
    ideal_soil: "Rich, loamy soil",
    watering: "Regular watering",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal", "Dye"],
    region: "South Asia",
    family: "Zingiberaceae",
    genus: "Curcuma",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.6–1 meter",
  },
  {
    id: "auth-4",
    scientific_name: "Phyllanthus emblica",
    common_name: "Indian Gooseberry",
    urdu_name: "آملہ",
    description:
      "A deciduous tree known for its edible fruit rich in vitamin C.",
    ideal_soil: "Light loamy to sandy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Haircare", "Culinary"],
    region: "India, Pakistan",
    family: "Phyllanthaceae",
    genus: "Phyllanthus",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "8–18 meters",
  },
  {
    id: "auth-5",
    scientific_name: "Withania somnifera",
    common_name: "Ashwagandha",
    urdu_name: "اشوگندھا",
    description:
      "A medicinal herb used in Ayurvedic medicine to reduce stress and improve vitality.",
    ideal_soil: "Sandy loam with good drainage",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Medicinal", "Tonic", "Adaptogen"],
    region: "India, Middle East",
    family: "Solanaceae",
    genus: "Withania",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Moderate",
    max_height: "0.5–1.5 meters",
  },
  {
    id: "auth-6",
    scientific_name: "Aloe barbadensis",
    common_name: "Aloe Vera",
    urdu_name: "گھیکوار",
    description:
      "Succulent plant whose gel is widely used for skin care and digestive health.",
    ideal_soil: "Sandy, well-drained soil",
    watering: "Low to moderate",
    sunlight: "Full sun to partial shade",
    uses: ["Medicinal", "Skincare", "Beverage"],
    region: "Worldwide",
    family: "Asphodelaceae",
    genus: "Aloe",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.6–1 meter",
  },
  {
    id: "auth-7",
    scientific_name: "Mentha piperita",
    common_name: "Peppermint",
    urdu_name: "پودینہ",
    description:
      "Aromatic herb used for culinary, medicinal, and tea purposes.",
    ideal_soil: "Moist, rich loam",
    watering: "Regular",
    sunlight: "Full sun to partial shade",
    uses: ["Culinary", "Medicinal", "Tea"],
    region: "Europe, Asia",
    family: "Lamiaceae",
    genus: "Mentha",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.3–0.9 meters",
  },
  {
    id: "auth-8",
    scientific_name: "Zingiber officinale",
    common_name: "Ginger",
    urdu_name: "ادرک",
    description:
      "Rhizomatous plant used as a spice and in traditional medicine.",
    ideal_soil: "Well-drained loam",
    watering: "Regular",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal"],
    region: "South Asia",
    family: "Zingiberaceae",
    genus: "Zingiber",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.6–1 meter",
  },
  {
    id: "auth-9",
    scientific_name: "Trigonella foenum-graecum",
    common_name: "Fenugreek",
    urdu_name: "میتھی",
    description: "Annual herb used for culinary and medicinal purposes.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Mediterranean, South Asia",
    family: "Fabaceae",
    genus: "Trigonella",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.6 meters",
  },
  {
    id: "auth-10",
    scientific_name: "Nigella sativa",
    common_name: "Black Seed",
    urdu_name: "کلونجی",
    description:
      "Annual flowering plant used for its seeds in traditional medicine.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Culinary"],
    region: "Southwest Asia",
    family: "Ranunculaceae",
    genus: "Nigella",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.2–0.5 meters",
  },
  {
    id: "auth-11",
    scientific_name: "Coriandrum sativum",
    common_name: "Coriander",
    urdu_name: "دھنیا",
    description:
      "Annual herb used for its leaves and seeds in cooking and medicine.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Mediterranean, South Asia",
    family: "Apiaceae",
    genus: "Coriandrum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.5 meters",
  },
  {
    id: "auth-12",
    scientific_name: "Allium sativum",
    common_name: "Garlic",
    urdu_name: "لہسن",
    description:
      "Bulbous plant used for its pungent bulbs in cooking and medicine.",
    ideal_soil: "Loose, well-drained soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Central Asia",
    family: "Amaryllidaceae",
    genus: "Allium",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.6 meters",
  },
  {
    id: "auth-13",
    scientific_name: "Terminalia chebula",
    common_name: "Haritaki",
    urdu_name: "ہڑڑ",
    description: "Deciduous tree, fruit used in traditional medicine.",
    ideal_soil: "Loamy to sandy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "South Asia",
    family: "Combretaceae",
    genus: "Terminalia",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "30 meters",
  },
  {
    id: "auth-14",
    scientific_name: "Emblica officinalis",
    common_name: "Amla",
    urdu_name: "آملہ",
    description: "Deciduous tree, fruit rich in vitamin C, used in Ayurveda.",
    ideal_soil: "Light loamy to sandy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Culinary", "Haircare"],
    region: "India, Pakistan",
    family: "Phyllanthaceae",
    genus: "Phyllanthus",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "8–18 meters",
  },
  {
    id: "auth-15",
    scientific_name: "Centella asiatica",
    common_name: "Gotu Kola",
    urdu_name: "برہمی بوٹی",
    description: "Creeping herb, used to enhance memory and healing.",
    ideal_soil: "Moist, rich soil",
    watering: "Regular",
    sunlight: "Partial shade",
    uses: ["Medicinal", "Culinary"],
    region: "Asia",
    family: "Apiaceae",
    genus: "Centella",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.2–0.3 meters",
  },
  {
    id: "auth-16",
    scientific_name: "Moringa oleifera",
    common_name: "Moringa",
    urdu_name: "سہانجنہ",
    description: "Fast-growing tree, leaves and pods highly nutritious.",
    ideal_soil: "Well-drained sandy or loamy soil",
    watering: "Low to moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Nutritional", "Culinary"],
    region: "South Asia, Africa",
    family: "Moringaceae",
    genus: "Moringa",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "10–12 meters",
  },
  {
    id: "auth-17",
    scientific_name: "Ficus religiosa",
    common_name: "Sacred Fig",
    urdu_name: "پیپل",
    description:
      "Large tree, sacred in Indian religions, medicinal bark and leaves.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Religious"],
    region: "Indian Subcontinent",
    family: "Moraceae",
    genus: "Ficus",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Moderate",
    max_height: "30 meters",
  },
  {
    id: "auth-18",
    scientific_name: "Rauwolfia serpentina",
    common_name: "Indian Snakeroot",
    urdu_name: "سرفا",
    description: "Shrub, roots used for hypertension and mental disorders.",
    ideal_soil: "Moist, well-drained soil",
    watering: "Regular",
    sunlight: "Partial shade",
    uses: ["Medicinal"],
    region: "South Asia",
    family: "Apocynaceae",
    genus: "Rauwolfia",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "0.6–1 meter",
  },
  {
    id: "auth-19",
    scientific_name: "Cassia angustifolia",
    common_name: "Senna",
    urdu_name: "سنا مکی",
    description: "Shrub, leaves used as a natural laxative.",
    ideal_soil: "Sandy, well-drained soil",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "South Asia, Africa",
    family: "Fabaceae",
    genus: "Senna",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "1–2 meters",
  },
  {
    id: "auth-20",
    scientific_name: "Glycyrrhiza glabra",
    common_name: "Licorice",
    urdu_name: "ملیٹھی",
    description: "Perennial herb, roots used for flavor and medicine.",
    ideal_soil: "Deep, fertile, well-drained soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Culinary"],
    region: "Europe, Asia",
    family: "Fabaceae",
    genus: "Glycyrrhiza",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Moderate",
    max_height: "1–1.5 meters",
  },
  {
    id: "auth-21",
    scientific_name: "Punica granatum",
    common_name: "Pomegranate",
    urdu_name: "انار",
    description: "Fruit-bearing shrub, fruit rich in antioxidants.",
    ideal_soil: "Loamy, well-drained soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Iran, India, Mediterranean",
    family: "Lythraceae",
    genus: "Punica",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "5–10 meters",
  },
  {
    id: "auth-22",
    scientific_name: "Lawsonia inermis",
    common_name: "Henna",
    urdu_name: "مہندی",
    description: "Shrub, leaves used for dye and medicinal purposes.",
    ideal_soil: "Sandy, well-drained soil",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Dye", "Medicinal"],
    region: "North Africa, South Asia",
    family: "Lythraceae",
    genus: "Lawsonia",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "2–6 meters",
  },
  {
    id: "auth-23",
    scientific_name: "Cymbopogon citratus",
    common_name: "Lemongrass",
    urdu_name: "لیمن گراس",
    description: "Tropical grass, leaves used for tea and flavoring.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Regular",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal", "Tea"],
    region: "South Asia, Southeast Asia",
    family: "Poaceae",
    genus: "Cymbopogon",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "1–1.5 meters",
  },
  {
    id: "auth-24",
    scientific_name: "Ocimum basilicum",
    common_name: "Sweet Basil",
    urdu_name: "تلسی",
    description: "Annual herb, aromatic leaves used in cooking.",
    ideal_soil: "Rich, well-drained soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Tropics, Mediterranean",
    family: "Lamiaceae",
    genus: "Ocimum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.3–0.6 meters",
  },
  {
    id: "auth-25",
    scientific_name: "Rosmarinus officinalis",
    common_name: "Rosemary",
    urdu_name: "اکلیل کوہستانی",
    description:
      "Woody perennial herb, aromatic leaves used in cooking and medicine.",
    ideal_soil: "Well-drained sandy soil",
    watering: "Low to moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Mediterranean",
    family: "Lamiaceae",
    genus: "Rosmarinus",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "1–2 meters",
  },
  {
    id: "auth-26",
    scientific_name: "Salvia officinalis",
    common_name: "Sage",
    urdu_name: "سیج",
    description:
      "Perennial herb, aromatic leaves used for culinary and medicinal purposes.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Mediterranean",
    family: "Lamiaceae",
    genus: "Salvia",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.6–0.8 meters",
  },
  {
    id: "auth-27",
    scientific_name: "Matricaria chamomilla",
    common_name: "Chamomile",
    urdu_name: "بابونہ",
    description: "Annual herb, flowers used for tea and calming remedies.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Tea", "Medicinal"],
    region: "Europe, Asia",
    family: "Asteraceae",
    genus: "Matricaria",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.2–0.6 meters",
  },
  {
    id: "auth-28",
    scientific_name: "Calendula officinalis",
    common_name: "Marigold",
    urdu_name: "گل اشرفی",
    description: "Annual flower, petals used for skin healing and dye.",
    ideal_soil: "Well-drained, fertile soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Dye"],
    region: "Mediterranean",
    family: "Asteraceae",
    genus: "Calendula",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.3–0.6 meters",
  },
  {
    id: "auth-29",
    scientific_name: "Foeniculum vulgare",
    common_name: "Fennel",
    urdu_name: "سونف",
    description:
      "Perennial herb, seeds and leaves used in cooking and medicine.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Mediterranean",
    family: "Apiaceae",
    genus: "Foeniculum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "1.5–2.5 meters",
  },
  {
    id: "auth-30",
    scientific_name: "Petroselinum crispum",
    common_name: "Parsley",
    urdu_name: "اجوائن پتہ",
    description: "Biennial herb, leaves used in cooking and as garnish.",
    ideal_soil: "Rich, well-draining soil",
    watering: "Moderate",
    sunlight: "Full sun to partial shade",
    uses: ["Culinary", "Medicinal"],
    region: "Mediterranean",
    family: "Apiaceae",
    genus: "Petroselinum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.3–0.6 meters",
  },
  {
    id: "auth-31",
    scientific_name: "Piper nigrum",
    common_name: "Black Pepper",
    urdu_name: "کالی مرچ",
    description: "Vine, berries used as spice and in medicine.",
    ideal_soil: "Rich, well-drained soil",
    watering: "Regular",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal"],
    region: "South India",
    family: "Piperaceae",
    genus: "Piper",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Moderate",
    max_height: "10 meters (vine)",
  },
  {
    id: "auth-32",
    scientific_name: "Syzygium aromaticum",
    common_name: "Clove",
    urdu_name: "لونگ",
    description: "Evergreen tree, flower buds used as spice and medicine.",
    ideal_soil: "Rich, loamy soil",
    watering: "Regular",
    sunlight: "Full sun to partial shade",
    uses: ["Culinary", "Medicinal"],
    region: "Indonesia, South Asia",
    family: "Myrtaceae",
    genus: "Syzygium",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "8–12 meters",
  },
  {
    id: "auth-33",
    scientific_name: "Cinnamomum verum",
    common_name: "Cinnamon",
    urdu_name: "دار چینی",
    description: "Evergreen tree, bark used as spice and medicine.",
    ideal_soil: "Well-drained, sandy loam",
    watering: "Moderate",
    sunlight: "Partial shade",
    uses: ["Culinary", "Medicinal"],
    region: "Sri Lanka, South Asia",
    family: "Lauraceae",
    genus: "Cinnamomum",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "10–15 meters",
  },
  {
    id: "auth-34",
    scientific_name: "Eclipta prostrata",
    common_name: "False Daisy",
    urdu_name: "بھنگرا",
    description: "Herb, used for hair health and liver support.",
    ideal_soil: "Moist, fertile soil",
    watering: "Regular",
    sunlight: "Full sun to partial shade",
    uses: ["Medicinal", "Haircare"],
    region: "Asia, Americas",
    family: "Asteraceae",
    genus: "Eclipta",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.3–0.6 meters",
  },
  {
    id: "auth-35",
    scientific_name: "Bacopa monnieri",
    common_name: "Brahmi",
    urdu_name: "برہمی",
    description: "Creeping herb, used for cognitive enhancement.",
    ideal_soil: "Moist, fertile soil",
    watering: "Regular",
    sunlight: "Partial shade",
    uses: ["Medicinal"],
    region: "Asia",
    family: "Plantaginaceae",
    genus: "Bacopa",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "0.2–0.3 meters",
  },
  {
    id: "auth-36",
    scientific_name: "Justicia adhatoda",
    common_name: "Malabar Nut",
    urdu_name: "واسا",
    description: "Shrub, leaves used for respiratory ailments.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "South Asia",
    family: "Acanthaceae",
    genus: "Justicia",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "2–3 meters",
  },
  {
    id: "auth-37",
    scientific_name: "Solanum nigrum",
    common_name: "Black Nightshade",
    urdu_name: "کاکمچی",
    description: "Annual herb, used in traditional medicine.",
    ideal_soil: "Well-drained, fertile soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "Worldwide",
    family: "Solanaceae",
    genus: "Solanum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "1 meter",
  },
  {
    id: "auth-38",
    scientific_name: "Tinospora cordifolia",
    common_name: "Giloy",
    urdu_name: "گلوئے",
    description: "Climbing shrub, used for immunity and fever.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun to partial shade",
    uses: ["Medicinal"],
    region: "India",
    family: "Menispermaceae",
    genus: "Tinospora",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "10 meters (vine)",
  },
  {
    id: "auth-39",
    scientific_name: "Aegle marmelos",
    common_name: "Bael",
    urdu_name: "بیل پتھر",
    description: "Deciduous tree, fruit used for digestive health.",
    ideal_soil: "Sandy loam, well-drained",
    watering: "Low to moderate",
    sunlight: "Full sun",
    uses: ["Medicinal", "Culinary"],
    region: "India, Southeast Asia",
    family: "Rutaceae",
    genus: "Aegle",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Slow",
    max_height: "12–15 meters",
  },
  {
    id: "auth-40",
    scientific_name: "Terminalia arjuna",
    common_name: "Arjuna",
    urdu_name: "ارجن",
    description: "Large tree, bark used for heart health.",
    ideal_soil: "Moist, well-drained soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "India",
    family: "Combretaceae",
    genus: "Terminalia",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "20–25 meters",
  },
  {
    id: "auth-41",
    scientific_name: "Murraya koenigii",
    common_name: "Curry Leaf",
    urdu_name: "کری پتہ",
    description: "Small tree, aromatic leaves used in cooking.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "South Asia",
    family: "Rutaceae",
    genus: "Murraya",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "4–6 meters",
  },
  {
    id: "auth-42",
    scientific_name: "Ocimum gratissimum",
    common_name: "Clove Basil",
    urdu_name: "تلسی",
    description: "Aromatic perennial herb, used for flavor and medicine.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Culinary", "Medicinal"],
    region: "Africa, Asia",
    family: "Lamiaceae",
    genus: "Ocimum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "1–2 meters",
  },
  {
    id: "auth-43",
    scientific_name: "Peganum harmala",
    common_name: "Syrian Rue",
    urdu_name: "اسپند",
    description:
      "Perennial herb, seeds used in traditional medicine and rituals.",
    ideal_soil: "Sandy, well-drained soil",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Medicinal", "Religious"],
    region: "Middle East, South Asia",
    family: "Nitrariaceae",
    genus: "Peganum",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.3–0.8 meters",
  },
  {
    id: "auth-44",
    scientific_name: "Althaea officinalis",
    common_name: "Marshmallow",
    urdu_name: "خطمی",
    description: "Perennial herb, roots used for soothing remedies.",
    ideal_soil: "Moist, rich soil",
    watering: "Regular",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "Europe, Asia",
    family: "Malvaceae",
    genus: "Althaea",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "1–1.5 meters",
  },
  {
    id: "auth-45",
    scientific_name: "Cassia fistula",
    common_name: "Golden Shower Tree",
    urdu_name: "امالتاس",
    description: "Deciduous tree, pods used as laxative.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "South Asia, Southeast Asia",
    family: "Fabaceae",
    genus: "Cassia",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "10–20 meters",
  },
  {
    id: "auth-46",
    scientific_name: "Cissus quadrangularis",
    common_name: "Veldt Grape",
    urdu_name: "ہڈجوڑ",
    description: "Succulent vine, used for bone health.",
    ideal_soil: "Well-drained sandy soil",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "Africa, Asia",
    family: "Vitaceae",
    genus: "Cissus",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Fast",
    max_height: "1–1.5 meters",
  },
  {
    id: "auth-47",
    scientific_name: "Achillea millefolium",
    common_name: "Yarrow",
    urdu_name: "برگ سوسن",
    description: "Perennial herb, used for wound healing.",
    ideal_soil: "Well-drained sandy loam",
    watering: "Low to moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "Europe, Asia",
    family: "Asteraceae",
    genus: "Achillea",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.6–1 meter",
  },
  {
    id: "auth-48",
    scientific_name: "Viola odorata",
    common_name: "Sweet Violet",
    urdu_name: "بنفشہ",
    description: "Perennial herb, flowers used for cough and cold remedies.",
    ideal_soil: "Moist, rich soil",
    watering: "Regular",
    sunlight: "Partial shade",
    uses: ["Medicinal"],
    region: "Europe, Asia",
    family: "Violaceae",
    genus: "Viola",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "0.1–0.2 meters",
  },
  {
    id: "auth-49",
    scientific_name: "Adhatoda vasica",
    common_name: "Malabar Nut",
    urdu_name: "واسا",
    description: "Shrub, leaves used for respiratory health.",
    ideal_soil: "Well-drained loamy soil",
    watering: "Moderate",
    sunlight: "Full sun",
    uses: ["Medicinal"],
    region: "South Asia",
    family: "Acanthaceae",
    genus: "Adhatoda",
    verified: true,
    care_difficulty: "Easy",
    growth_rate: "Moderate",
    max_height: "2–3 meters",
  },
  {
    id: "auth-50",
    scientific_name: "Santalum album",
    common_name: "Sandalwood",
    urdu_name: "چندن",
    description: "Small tree, fragrant wood used in rituals and medicine.",
    ideal_soil: "Well-drained sandy soil",
    watering: "Low",
    sunlight: "Full sun",
    uses: ["Medicinal", "Religious", "Fragrance"],
    region: "India, Southeast Asia",
    family: "Santalaceae",
    genus: "Santalum",
    verified: true,
    care_difficulty: "Moderate",
    growth_rate: "Slow",
    max_height: "4–9 meters",
  },
];

// Add categorized plant data
const plantCategories = [
  {
    id: "air-purifying",
    name: "Air Purifying Plants",
    description: "Plants that help clean indoor air and remove toxins",
    plants: [
      {
        id: "air-1",
        scientific_name: "Epipremnum aureum",
        common_name: "Money Plant",
        urdu_name: "منی پلانٹ",
        description:
          "Excellent air purifier that removes formaldehyde and other toxins.",
        ideal_soil: "Well-draining potting mix",
        watering: "Allow soil to dry between waterings",
        sunlight: "Indirect light",
        benefits: "Removes benzene, formaldehyde, xylene from air",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/b/b2/Epipremnum_aureum_31082012.jpg",
      },
      {
        id: "air-2",
        scientific_name: "Sansevieria trifasciata",
        common_name: "Snake Plant",
        urdu_name: "سانپ پودا",
        description: "Converts CO2 to oxygen at night, ideal for bedrooms.",
        ideal_soil: "Sandy, well-draining soil",
        watering: "Drought-tolerant, water sparingly",
        sunlight: "Low to bright indirect light",
        benefits: "Filters benzene, formaldehyde, trichloroethylene, xylene",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg/800px-Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg",
      },
      {
        id: "air-3",
        scientific_name: "Hedera helix",
        common_name: "English Ivy",
        urdu_name: "انگریزی آئیوی",
        description: "NASA-recommended plant for air purification.",
        ideal_soil: "Rich potting soil with good drainage",
        watering: "Keep soil moist but not soggy",
        sunlight: "Moderate indirect light",
        benefits: "Reduces mold spores in air, removes formaldehyde",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Hedera_helix_foliage.jpg/1200px-Hedera_helix_foliage.jpg",
      },
      {
        id: "air-4",
        scientific_name: "Chlorophytum comosum",
        common_name: "Spider Plant",
        urdu_name: "سپائیڈر پلانٹ",
        description:
          "Easy to grow plant with arching leaves and small plantlets.",
        ideal_soil: "Well-draining potting soil",
        watering: "Allow soil to dry slightly between waterings",
        sunlight: "Bright indirect light",
        benefits: "Removes formaldehyde, xylene and carbon monoxide",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Hierbabuena_0611_Revised.jpg",
      },
      {
        id: "air-5",
        scientific_name: "Ficus elastica",
        common_name: "Rubber Plant",
        urdu_name: "ربڑ پلانٹ",
        description: "Popular houseplant with large, glossy leaves.",
        ideal_soil: "Well-draining, peaty soil",
        watering: "Allow top inch of soil to dry between waterings",
        sunlight: "Bright indirect light",
        benefits: "Removes formaldehyde and other airborne toxins",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/9d/Ficus_elastica_Melany.jpg",
      },
      {
        id: "air-6",
        scientific_name: "Spathiphyllum wallisii",
        common_name: "Peace Lily",
        urdu_name: "پیس لِلی",
        description: "Elegant plant with dark green leaves and white flowers.",
        ideal_soil: "Rich, loose potting soil",
        watering: "Keep soil moist, droops when thirsty",
        sunlight: "Low to medium indirect light",
        benefits:
          "Removes ammonia, benzene, formaldehyde and trichloroethylene",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Spathiphyllum_cochlearispathum_RTBG.jpg/800px-Spathiphyllum_cochlearispathum_RTBG.jpg",
      },
      {
        id: "air-7",
        scientific_name: "Dracaena marginata",
        common_name: "Dragon Tree",
        urdu_name: "ڈریگن ٹری",
        description: "Slender, upright plant with thin, arching leaves.",
        ideal_soil: "Well-draining potting mix",
        watering: "Allow soil to partially dry between waterings",
        sunlight: "Bright indirect light",
        benefits: "Removes benzene, formaldehyde, and trichloroethylene",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dracaena_marginata_-_potted.jpg/800px-Dracaena_marginata_-_potted.jpg",
      },
      {
        id: "air-8",
        scientific_name: "Ficus benjamina",
        common_name: "Weeping Fig",
        urdu_name: "فکس بینجامینا",
        description: "Elegant tree with glossy leaves and graceful form.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Keep soil evenly moist, allow top to dry out slightly",
        sunlight: "Bright indirect light",
        benefits: "Filters airborne toxins including formaldehyde",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Ficus_benjamina2.jpg/800px-Ficus_benjamina2.jpg",
      },
    ],
  },
  {
    id: "low-maintenance",
    name: "Low Maintenance Plants",
    description: "Plants that thrive with minimal care",
    plants: [
      {
        id: "low-1",
        scientific_name: "Zamioculcas zamiifolia",
        common_name: "ZZ Plant",
        urdu_name: "زیڈ زیڈ پودا",
        description: "Nearly indestructible houseplant that tolerates neglect.",
        ideal_soil: "Well-draining potting mix",
        watering: "Allow to dry out completely between waterings",
        sunlight: "Low to bright indirect light",
        benefits: "Air purifying, drought-tolerant",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Zamioculcas_zamiifolia_-_Botanischer_Garten%2C_Dresden.jpg/1200px-Zamioculcas_zamiifolia_-_Botanischer_Garten%2C_Dresden.jpg",
      },
      {
        id: "low-2",
        scientific_name: "Aloe vera",
        common_name: "Aloe Vera",
        urdu_name: "ایلو ویرا",
        description: "Medicinal succulent that needs minimal attention.",
        ideal_soil: "Sandy, well-draining soil",
        watering: "Infrequent, allow to dry between waterings",
        sunlight: "Bright indirect light",
        benefits: "Medicinal properties, air purifying",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/4/4b/Aloe_vera_flower_inset.png",
      },
      {
        id: "low-3",
        scientific_name: "Aspidistra elatior",
        common_name: "Cast Iron Plant",
        urdu_name: "آہنی پودا",
        description:
          "Extremely tough plant that can survive neglect, poor light, and inconsistent watering.",
        ideal_soil: "Well-draining potting soil",
        watering: "Infrequent, tolerates dry soil well",
        sunlight: "Low light to moderate indirect light",
        benefits: "Air purifying, nearly indestructible",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/5/57/Aspidistra_elatior1.jpg",
      },
      {
        id: "low-4",
        scientific_name: "Aglaonema commutatum",
        common_name: "Chinese Evergreen",
        urdu_name: "چینی ہمیشہ بہار",
        description:
          "Decorative plant with variegated leaves that thrives in low light.",
        ideal_soil: "Well-draining potting soil with peat",
        watering: "Keep soil lightly moist",
        sunlight: "Low to medium indirect light",
        benefits: "Air purifying, removes benzene and formaldehyde",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/8/8c/Aglaonema_nitidum_-_Silver_Queen.JPG",
      },
      {
        id: "low-5",
        scientific_name: "Dracaena trifasciata",
        common_name: "Snake Plant",
        urdu_name: "سانپ پودا",
        description:
          "Upright succulent with sword-like leaves, extremely hardy.",
        ideal_soil: "Sandy, well-draining soil",
        watering: "Very infrequent, allow to completely dry out",
        sunlight: "Any light level, from low to bright indirect",
        benefits: "Air purifying, converts CO2 to O2 at night",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg/800px-Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg",
      },
    ],
  },
  {
    id: "stress-reducing",
    name: "Stress-Reducing Plants",
    description: "Plants that help reduce stress and anxiety",
    plants: [
      {
        id: "stress-1",
        scientific_name: "Lavandula",
        common_name: "Lavender",
        urdu_name: "لیونڈر",
        description: "Aromatic herb known for its calming properties.",
        ideal_soil: "Well-draining alkaline soil",
        watering: "Low to moderate, allow soil to dry between waterings",
        sunlight: "Full sun",
        benefits: "Relaxing aroma, stress reduction",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Lavender_flowers.jpg/1200px-Lavender_flowers.jpg",
      },
      {
        id: "stress-2",
        scientific_name: "Jasmine officinale",
        common_name: "Jasmine",
        urdu_name: "چنبیلی",
        description: "Fragrant flowering plant with calming effects.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, keeping soil moist",
        sunlight: "Full to partial sun",
        benefits: "Improves sleep quality, reduces anxiety",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Jasminum_officinale.JPG/1200px-Jasminum_officinale.JPG",
      },
      {
        id: "stress-3",
        scientific_name: "Ocimum basilicum",
        common_name: "Basil",
        urdu_name: "تلسی",
        description:
          "Aromatic herb with a distinctive flavor and stress-reducing scent.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Keep soil consistently moist",
        sunlight: "Full sun",
        benefits: "Reduces stress, promotes relaxation, edible herb",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/90/Basil-Basilico-Ocimum_basilicum-albahaca.jpg",
      },
      {
        id: "stress-4",
        scientific_name: "Rosmarinus officinalis",
        common_name: "Rosemary",
        urdu_name: "روزمیری",
        description:
          "Evergreen herb with pine-like fragrance known to boost cognitive function.",
        ideal_soil: "Sandy, well-draining soil",
        watering: "Allow soil to dry between waterings",
        sunlight: "Full sun",
        benefits: "Improves memory, reduces stress and anxiety",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/e/ea/Rosemary_in_bloom.JPG",
      },
      {
        id: "stress-5",
        scientific_name: "Gardenia jasminoides",
        common_name: "Gardenia",
        urdu_name: "گارڈینیا",
        description: "Evergreen shrub with intensely fragrant white flowers.",
        ideal_soil: "Acidic, well-draining soil",
        watering: "Keep soil evenly moist",
        sunlight: "Bright indirect light",
        benefits: "Aromatherapy benefits for stress and anxiety",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/9/9d/GardeniaJasminoides-Flower1.jpg",
      },
    ],
  },
  {
    id: "water-saving",
    name: "Water-Saving Plants",
    description: "Drought-tolerant plants that require minimal water",
    plants: [
      {
        id: "water-1",
        scientific_name: "Crassula ovata",
        common_name: "Jade Plant",
        urdu_name: "جیڈ پلانٹ",
        description: "Succulent that stores water in its leaves.",
        ideal_soil: "Cactus or succulent mix",
        watering: "Sparingly, only when soil is dry",
        sunlight: "Bright light",
        benefits: "Water conservation, air purifying",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Crassula_ovata_flowering_%282%29.jpg/1200px-Crassula_ovata_flowering_%282%29.jpg",
      },
      {
        id: "water-2",
        scientific_name: "Sedum morganianum",
        common_name: "Burro's Tail",
        urdu_name: "گدھے کی دُم",
        description:
          "Trailing succulent with overlapping leaves that stores water.",
        ideal_soil: "Cactus mix with perlite",
        watering: "Sparingly, only when completely dry",
        sunlight: "Bright indirect light",
        benefits: "Water conservation, decorative hanging plant",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/5/5a/Sedum_morganianum_2.jpg",
      },
      {
        id: "water-3",
        scientific_name: "Haworthia fasciata",
        common_name: "Zebra Plant",
        urdu_name: "زیبرا پودا",
        description:
          "Small succulent with distinctive white stripes and very low water needs.",
        ideal_soil: "Sandy, well-draining soil",
        watering: "Allow to dry completely between waterings",
        sunlight: "Bright indirect light",
        benefits: "Water conservation, decorative, office-friendly",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/d/df/Haworthia_fasciata_-_Hartford_1_09_05.jpg",
      },
      {
        id: "water-4",
        scientific_name: "Opuntia microdasys",
        common_name: "Bunny Ears Cactus",
        urdu_name: "خرگوش کے کان",
        description: "Small decorative cactus with distinctive pad-like stems.",
        ideal_soil: "Cactus potting mix with extra sand/perlite",
        watering: "Very sparingly, allow to dry out completely",
        sunlight: "Bright direct light",
        benefits: "Extremely drought-tolerant, minimal water needs",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/6/6a/Opuntia_microdasys_%28aurispina%29.JPG",
      },
      {
        id: "water-5",
        scientific_name: "Echinocactus grusonii",
        common_name: "Golden Barrel Cactus",
        urdu_name: "سنہری پیپا کیکٹس",
        description: "Spherical cactus with prominent ribs and golden spines.",
        ideal_soil: "Very well-draining cactus mix",
        watering: "Minimal, only when soil is completely dry",
        sunlight: "Full sun",
        benefits: "Extremely drought-tolerant, architectural interest",
        maintenance: "Very Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/a/a5/Echinocactus_grusonii_1.jpg",
      },
    ],
  },
  {
    id: "medicinal",
    name: "Medicinal Plants",
    description: "Plants with therapeutic and healing properties",
    plants: [
      {
        id: "med-1",
        scientific_name: "Aloe vera",
        common_name: "Aloe Vera",
        urdu_name: "ایلو ویرا",
        description: "Succulent with healing gel inside its leaves.",
        ideal_soil: "Sandy, well-draining soil",
        watering: "Infrequent, allow to dry between watering",
        sunlight: "Bright indirect light",
        benefits: "Heals burns, moisturizes skin, anti-inflammatory",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/4/4b/Aloe_vera_flower_inset.png",
      },
      {
        id: "med-2",
        scientific_name: "Calendula officinalis",
        common_name: "Calendula",
        urdu_name: "کیلنڈولا",
        description: "Flowering herb with bright yellow-orange blooms.",
        ideal_soil: "Well-draining, fertile soil",
        watering: "Regular, keeping soil moist but not soggy",
        sunlight: "Full sun to partial shade",
        benefits: "Anti-inflammatory, wound healing, skin conditions",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/a/a8/Pot_marigold.jpg",
      },
      {
        id: "med-3",
        scientific_name: "Mentha piperita",
        common_name: "Peppermint",
        urdu_name: "پودینہ",
        description: "Aromatic herb with cooling properties.",
        ideal_soil: "Rich, moist soil with good drainage",
        watering: "Regular, keeping soil consistently moist",
        sunlight: "Partial shade",
        benefits: "Relieves digestive issues, headaches, and muscle pain",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/5/5d/Mint_leaves_in_a_colony.jpg",
      },
    ],
  },
  {
    id: "edible-garden",
    name: "Edible Garden Plants",
    description: "Fruits, vegetables, and herbs for home cultivation",
    plants: [
      {
        id: "edible-1",
        scientific_name: "Solanum lycopersicum",
        common_name: "Tomato",
        urdu_name: "ٹماٹر",
        description: "Popular garden vegetable with juicy red fruits.",
        ideal_soil: "Rich, well-draining soil with organic matter",
        watering: "Regular, consistent moisture",
        sunlight: "Full sun (6-8 hours)",
        benefits: "Rich in vitamins, antioxidants, and lycopene",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section02.jpg/800px-Bright_red_tomato_and_cross_section02.jpg",
      },
      {
        id: "edible-2",
        scientific_name: "Capsicum annuum",
        common_name: "Bell Pepper",
        urdu_name: "شملہ مرچ",
        description: "Sweet, crunchy vegetable available in multiple colors.",
        ideal_soil: "Loamy, well-draining soil rich in organic matter",
        watering: "Regular, consistent moisture",
        sunlight: "Full sun",
        benefits: "High in vitamin C and antioxidants",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Green%2C_yellow%2C_and_red_bell_peppers.jpg/800px-Green%2C_yellow%2C_and_red_bell_peppers.jpg",
      },
      {
        id: "edible-3",
        scientific_name: "Lactuca sativa",
        common_name: "Lettuce",
        urdu_name: "سلاد",
        description: "Leafy green vegetable with crisp leaves.",
        ideal_soil: "Rich, moist soil with good drainage",
        watering: "Regular, keeping soil consistently moist",
        sunlight: "Partial shade in hot climates, full sun in cool areas",
        benefits: "Low calorie, high in vitamins and minerals",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Iceberg_lettuce_in_SB.jpg/800px-Iceberg_lettuce_in_SB.jpg",
      },
    ],
  },
  {
    id: "flowering",
    name: "Flowering Plants",
    description: "Beautiful blooming plants for vibrant gardens",
    plants: [
      {
        id: "flower-1",
        scientific_name: "Rosa species",
        common_name: "Rose",
        urdu_name: "گلاب",
        description: "Iconic flowering shrub with fragrant blooms.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, keeping soil consistently moist",
        sunlight: "Full sun (at least 6 hours)",
        benefits: "Beautiful blooms, fragrance, attracts pollinators",
        maintenance: "Medium to High",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rosa_rubiginosa_1.jpg/800px-Rosa_rubiginosa_1.jpg",
      },
      {
        id: "flower-2",
        scientific_name: "Hibiscus rosa-sinensis",
        common_name: "Hibiscus",
        urdu_name: "گل خیرو",
        description:
          "Tropical flowering plant with large, trumpet-shaped blooms.",
        ideal_soil: "Rich, well-draining, slightly acidic soil",
        watering: "Regular, consistent moisture",
        sunlight: "Full sun to partial shade",
        benefits: "Attracts pollinators, ornamental value",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Hibiscus_rosa-sinensis_flower_2.JPG/800px-Hibiscus_rosa-sinensis_flower_2.JPG",
      },
      {
        id: "flower-3",
        scientific_name: "Tagetes species",
        common_name: "Marigold",
        urdu_name: "گیندا",
        description: "Bright flowering annual with distinctive scent.",
        ideal_soil: "Well-draining soil, tolerates poor soil",
        watering: "Moderate, allow soil to dry between waterings",
        sunlight: "Full sun",
        benefits: "Pest repellent, attracts beneficial insects",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tagetes_patula_%27Bonanza_Flame%27_Marigold.jpg/800px-Tagetes_patula_%27Bonanza_Flame%27_Marigold.jpg",
      },
    ],
  },
  {
    id: "shade-loving",
    name: "Shade-Loving Plants",
    description: "Plants that thrive in low-light conditions",
    plants: [
      {
        id: "shade-1",
        scientific_name: "Hosta species",
        common_name: "Hosta",
        urdu_name: "ہوسٹا",
        description: "Foliage plant prized for its varied leaf patterns.",
        ideal_soil: "Rich, moist, well-draining soil",
        watering: "Regular, keeping soil consistently moist",
        sunlight: "Partial to full shade",
        benefits: "Attractive foliage, low maintenance",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Hosta_fortunei.jpg/800px-Hosta_fortunei.jpg",
      },
      {
        id: "shade-2",
        scientific_name: "Heuchera species",
        common_name: "Coral Bells",
        urdu_name: "کورل بیلز",
        description: "Colorful foliage plant with small bell-shaped flowers.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, keeping soil moist but not soggy",
        sunlight: "Partial to full shade",
        benefits: "Colorful foliage year-round, compact size",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Heuchera_sanguinea_-_Berlin_Botanical_Garden_-_IMG_8587.JPG/800px-Heuchera_sanguinea_-_Berlin_Botanical_Garden_-_IMG_8587.JPG",
      },
      {
        id: "shade-3",
        scientific_name: "Asplenium nidus",
        common_name: "Bird's Nest Fern",
        urdu_name: "پرندے کا گھونسلہ",
        description: "Tropical fern with wide, undivided fronds.",
        ideal_soil: "Rich, well-draining potting mix",
        watering: "Regular, keeping soil consistently moist",
        sunlight: "Moderate to deep shade",
        benefits: "Air purifying, tropical aesthetic",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Asplenium_nidus_-_Cornell_Botanic_Gardens.jpg/800px-Asplenium_nidus_-_Cornell_Botanic_Gardens.jpg",
      },
    ],
  },
  {
    id: "indoor-tropicals",
    name: "Indoor Tropical Plants",
    description: "Exotic plants that bring tropical vibes indoors",
    plants: [
      {
        id: "tropical-1",
        scientific_name: "Monstera deliciosa",
        common_name: "Swiss Cheese Plant",
        urdu_name: "سوئس چیز پلانٹ",
        description: "Popular houseplant with distinctive split leaves.",
        ideal_soil: "Well-draining potting mix with peat",
        watering: "Allow top inch of soil to dry between waterings",
        sunlight: "Bright indirect light",
        benefits: "Air purifying, dramatic foliage",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Monstera_deliciosa_iconic_leaf.jpg/800px-Monstera_deliciosa_iconic_leaf.jpg",
      },
      {
        id: "tropical-2",
        scientific_name: "Calathea ornata",
        common_name: "Pinstripe Plant",
        urdu_name: "کیلاتھیا",
        description: "Tropical plant with striking striped leaves.",
        ideal_soil: "Rich, well-draining potting mix",
        watering: "Keep soil consistently moist, not soggy",
        sunlight: "Medium to low indirect light",
        benefits: "Air purifying, decorative foliage",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Calathea_ornata.JPG/800px-Calathea_ornata.JPG",
      },
    ],
  },
  {
    id: "pet-friendly",
    name: "Pet-Friendly Plants",
    description: "Safe plants for homes with cats and dogs",
    plants: [
      {
        id: "pet-1",
        scientific_name: "Calathea species",
        common_name: "Calathea",
        urdu_name: "کیلاتھیا",
        description: "Tropical plant with decorative patterned leaves.",
        ideal_soil: "Rich, well-draining soil mix",
        watering: "Keep soil consistently moist",
        sunlight: "Medium to low indirect light",
        benefits: "Non-toxic to pets, air purifying",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Maranta_leuconeura_kerchoveana_-_prayer_plant_01.jpg/800px-Maranta_leuconeura_kerchoveana_-_prayer_plant_01.jpg",
      },
      {
        id: "pet-2",
        scientific_name: "Areca lutescens",
        common_name: "Areca Palm",
        urdu_name: "اریکا پام",
        description: "Feathery palm with multiple stems.",
        ideal_soil: "Well-draining potting mix",
        watering: "Allow top inch of soil to dry between waterings",
        sunlight: "Bright indirect light",
        benefits: "Non-toxic to pets, air purifying",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Dypsis_lutescens_outdoor.jpg/800px-Dypsis_lutescens_outdoor.jpg",
      },
    ],
  },
  {
    id: "fruit-trees",
    name: "Fruit Trees",
    description: "Trees that produce edible fruits",
    plants: [
      {
        id: "fruit-1",
        scientific_name: "Mangifera indica",
        common_name: "Mango Tree",
        urdu_name: "آم کا درخت",
        description: "Tropical fruit tree with sweet, juicy fruits.",
        ideal_soil: "Well-draining, slightly acidic soil",
        watering: "Regular when young, less frequent when established",
        sunlight: "Full sun",
        benefits: "Delicious fruits, shade, ornamental value",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Mango_tree_with_fruit_%28Mangifera_indica%29.jpg/800px-Mango_tree_with_fruit_%28Mangifera_indica%29.jpg",
      },
      {
        id: "fruit-2",
        scientific_name: "Citrus sinensis",
        common_name: "Orange Tree",
        urdu_name: "مالٹا کا درخت",
        description: "Evergreen citrus tree with aromatic flowers and fruits.",
        ideal_soil: "Well-draining, slightly acidic soil",
        watering: "Regular, consistent moisture",
        sunlight: "Full sun",
        benefits: "Vitamin C-rich fruits, fragrant blossoms",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Citrus_sinensis_%282%29.jpg/800px-Citrus_sinensis_%282%29.jpg",
      },
    ],
  },
  {
    id: "herbs",
    name: "Culinary Herbs",
    description: "Herbs used in cooking and flavoring dishes",
    plants: [
      {
        id: "herb-1",
        scientific_name: "Ocimum basilicum",
        common_name: "Sweet Basil",
        urdu_name: "تلسی",
        description: "Aromatic herb essential in Mediterranean cuisine.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, keeping soil moist but not soggy",
        sunlight: "Full sun to partial shade",
        benefits: "Culinary use, medicinal properties",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Basil-Basilico-Ocimum_basilicum-albahaca.jpg/800px-Basil-Basilico-Ocimum_basilicum-albahaca.jpg",
      },
      {
        id: "herb-2",
        scientific_name: "Coriandrum sativum",
        common_name: "Coriander/Cilantro",
        urdu_name: "دھنیا",
        description: "Versatile herb used in many cuisines worldwide.",
        ideal_soil: "Well-draining, moderately rich soil",
        watering: "Regular, keeping soil evenly moist",
        sunlight: "Full sun to partial shade",
        benefits: "Culinary use, both leaves and seeds are used",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Coriander-seeds.jpg/800px-Coriander-seeds.jpg",
      },
    ],
  },
  {
    id: "climbing",
    name: "Climbing Plants",
    description: "Plants that grow vertically on supports",
    plants: [
      {
        id: "climb-1",
        scientific_name: "Jasminum grandiflorum",
        common_name: "Spanish Jasmine",
        urdu_name: "چمبیلی",
        description: "Fragrant climbing vine with star-shaped white flowers.",
        ideal_soil: "Well-draining, fertile soil",
        watering: "Regular, keeping soil evenly moist",
        sunlight: "Full sun to partial shade",
        benefits: "Fragrant flowers, vertical gardening element",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Jasminum_grandiflorum_Blanco1.196-cropped.jpg/800px-Jasminum_grandiflorum_Blanco1.196-cropped.jpg",
      },
      {
        id: "climb-2",
        scientific_name: "Clematis species",
        common_name: "Clematis",
        urdu_name: "کلیماٹس",
        description: "Flowering vine with showy blooms in various colors.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, keeping soil moist but not waterlogged",
        sunlight: "Full sun with shaded roots",
        benefits: "Beautiful flowers, vertical interest",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Clematis_occidentalis_-_blossom_2_-_Flickr_-_S._Rae.jpg/800px-Clematis_occidentalis_-_blossom_2_-_Flickr_-_S._Rae.jpg",
      },
    ],
  },
  {
    id: "butterfly-garden",
    name: "Butterfly Garden Plants",
    description: "Plants that attract and support butterflies",
    plants: [
      {
        id: "butterfly-1",
        scientific_name: "Asclepias syriaca",
        common_name: "Common Milkweed",
        urdu_name: "دودھ پتا",
        description:
          "Native plant essential for monarch butterfly reproduction.",
        ideal_soil: "Well-draining soil, adaptable to various types",
        watering: "Drought-tolerant once established",
        sunlight: "Full sun",
        benefits: "Supports monarch butterflies, attracts pollinators",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Asclepias_syriaca_2.jpg/800px-Asclepias_syriaca_2.jpg",
      },
      {
        id: "butterfly-2",
        scientific_name: "Buddleja davidii",
        common_name: "Butterfly Bush",
        urdu_name: "تتلی بش",
        description:
          "Shrub with cone-shaped flower clusters that attract butterflies.",
        ideal_soil: "Well-draining soil",
        watering: "Moderate, drought-tolerant once established",
        sunlight: "Full sun",
        benefits: "Attracts multiple butterfly species, fragrant flowers",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Buddleja_davidii_MS_2418.JPG/800px-Buddleja_davidii_MS_2418.JPG",
      },
    ],
  },
  {
    id: "aromatic",
    name: "Aromatic Plants",
    description: "Plants with pleasant or distinctive scents",
    plants: [
      {
        id: "aromatic-1",
        scientific_name: "Cananga odorata",
        common_name: "Ylang-Ylang",
        urdu_name: "یلانگ یلانگ",
        description: "Tropical tree with extremely fragrant yellow flowers.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, consistent moisture",
        sunlight: "Full sun to partial shade",
        benefits: "Used in perfumery, aromatherapy, and essential oils",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Cananga_odorata_-_Marie_Selby_Botanical_Gardens_-_Sarasota%2C_Florida_-_DSC01737.jpg/800px-Cananga_odorata_-_Marie_Selby_Botanical_Gardens_-_Sarasota%2C_Florida_-_DSC01737.jpg",
      },
      {
        id: "aromatic-2",
        scientific_name: "Cymbopogon citratus",
        common_name: "Lemongrass",
        urdu_name: "لیمن گھاس",
        description: "Aromatic tropical plant with citrus-scented foliage.",
        ideal_soil: "Rich, well-draining soil",
        watering: "Regular, moist but not soggy",
        sunlight: "Full sun",
        benefits: "Culinary use, mosquito repellent, tea",
        maintenance: "Low",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cymbopogon.JPG/800px-Cymbopogon.JPG",
      },
    ],
  },
  {
    id: "bonsai",
    name: "Bonsai Plants",
    description:
      "Miniature trees grown in containers following ancient traditions",
    plants: [
      {
        id: "bonsai-1",
        scientific_name: "Ficus retusa",
        common_name: "Chinese Banyan",
        urdu_name: "چینی برگد",
        description:
          "Popular choice for bonsai with glossy leaves and aerial roots.",
        ideal_soil: "Well-draining bonsai mix",
        watering: "Regular but allow to dry slightly between waterings",
        sunlight: "Bright indirect light",
        benefits: "Adaptable, forgiving for beginners",
        maintenance: "Medium",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Ficus_bonsai%2C_Bontanic_Garden%2C_Chiang_Mai.jpg/800px-Ficus_bonsai%2C_Bontanic_Garden%2C_Chiang_Mai.jpg",
      },
      {
        id: "bonsai-2",
        scientific_name: "Juniperus procumbens",
        common_name: "Japanese Garden Juniper",
        urdu_name: "جاپانی باغ جونیپر",
        description:
          "Classic bonsai with blue-green needles and gnarled trunk.",
        ideal_soil: "Well-draining bonsai mix",
        watering: "Moderate, allow to dry slightly between waterings",
        sunlight: "Full sun",
        benefits: "Traditional appearance, hardy",
        maintenance: "Medium to High",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Juniperus_chinensis_%28juniper%29_bonsai%2C_unknown_age%2C_height_25_cm%2C_collected_in_Japan%2C_training_began_1974_-_Brooklyn_Botanic_Garden_-_Brooklyn%2C_NY_-_DSC08126.JPG/800px-Juniperus_chinensis_%28juniper%29_bonsai%2C_unknown_age%2C_height_25_cm%2C_collected_in_Japan%2C_training_began_1974_-_Brooklyn_Botanic_Garden_-_Brooklyn%2C_NY_-_DSC08126.JPG",
      },
    ],
  },
];
function PlantDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    // Load search history from local storage
    const savedHistory = localStorage.getItem("plantSearchHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryResults, setCategoryResults] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from local storage
    const savedFavorites = localStorage.getItem("plantFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false); // New state for showing favorites
  const [userContributedPlants, setUserContributedPlants] = useState(() => {
    // Load user contributed plants from local storage
    const savedPlants = localStorage.getItem("userContributedPlants");
    return savedPlants ? JSON.parse(savedPlants) : [];
  });
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [newPlant, setNewPlant] = useState({
    id: "",
    scientific_name: "",
    common_name: "",
    urdu_name: "",
    family: "",
    genus: "",
    description: "",
    ideal_soil: "",
    watering: "",
    sunlight: "",
    uses: "",
    region: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    setShowHistory(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("plantFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save user contributed plants to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "userContributedPlants",
      JSON.stringify(userContributedPlants)
    );
  }, [userContributedPlants]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setError("");
    setHasSearched(true);
    setLoading(true);
    setShowHistory(false);

    // Add to search history
    if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
      setSearchHistory((prev) => [searchTerm.trim(), ...prev].slice(0, 3));
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Search in popularPlantsData, authenticatedPlantsData AND userContributedPlants
    const matchingPlants = [
      ...popularPlantsData,
      ...authenticatedPlantsData,
      ...userContributedPlants, // Include user contributed plants
    ].filter(
      (plant) =>
        plant.common_name?.toLowerCase().includes(searchTermLower) ||
        plant.scientific_name?.toLowerCase().includes(searchTermLower) ||
        plant.urdu_name?.includes(searchTerm)
    );

    setSearchResults(matchingPlants);
    setLoading(false);
  };

  const selectPlant = (plant) => {
    setSelectedPlant(plant);
  };

  const closeDetails = () => {
    setSelectedPlant(null);
  };

  // Add a reset function to go back to the initial state
  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
    setError("");
  };

  // Handle suggestion click
  const handleHistoryItemClick = (term) => {
    setSearchTerm(term);
    setShowHistory(false);

    // Trigger search with the selected term
    const formEvent = { preventDefault: () => {} };
    handleSearch(formEvent);
  };

  // Handle search history selection from popup
  const handleHistorySelect = (term) => {
    setSearchTerm(term);
    setShowHistoryPopup(false);
    // Optionally trigger search immediately
    const formEvent = { preventDefault: () => {} };
    handleSearch(formEvent);
  };

  // Clear all search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("plantSearchHistory");
    setShowHistoryPopup(false);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    const category = plantCategories.find((cat) => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setCategoryResults(category.plants);
      setHasSearched(true); // Use existing state to show results
      setSearchResults([]); // Clear search results to avoid confusion
      setError("");
    }
  };

  // Reset category view
  const resetCategory = () => {
    setSelectedCategory(null);
    setCategoryResults([]);
    resetSearch();
  };

  // Reset favorites view
  const resetFavorites = () => {
    setShowFavorites(false);
    setHasSearched(false);
  };

  // Add to favorites function
  const addToFavorites = (plant, e) => {
    e.stopPropagation(); // Prevent clicking the card (which opens details)

    // Check if plant is already in favorites
    const isAlreadyFavorite = favorites.some((fav) => fav.id === plant.id);

    if (isAlreadyFavorite) {
      // Remove from favorites if already exists
      setFavorites((prev) => prev.filter((fav) => fav.id !== plant.id));
    } else {
      // Add to favorites
      setFavorites((prev) => [...prev, plant]);
    }
  };

  // Check if a plant is in favorites
  const isFavorite = (plantId) => {
    return favorites.some((fav) => fav.id === plantId);
  };

  // Add a new function to handle the FormSubmission navigation
  const handleFormSubmissionClick = () => {
    navigate("/PlantSubmission"); // Navigate to the FormSubmission page
  };

  // Add handleQuickSearch function before the return statement
  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    // Create a synthetic event object to pass to handleSearch
    const syntheticEvent = { preventDefault: () => {} };
    handleSearch(syntheticEvent);
  };

  // Handle form change for contribution form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPlant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};
    if (!newPlant.scientific_name.trim())
      errors.scientific_name = "Scientific name is required";
    if (!newPlant.common_name.trim())
      errors.common_name = "Common name is required";
    if (!newPlant.description.trim())
      errors.description = "Description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleContributionSubmit = (e) => {
    e.preventDefault();

    // Reset success message
    setFormSuccess(false);

    // Validate form
    if (!validateForm()) return;

    // Process uses field to ensure it's an array
    let processedUses = newPlant.uses;
    if (typeof processedUses === "string" && processedUses.trim()) {
      processedUses = processedUses.split(",").map((item) => item.trim());
    } else if (!Array.isArray(processedUses)) {
      processedUses = [];
    }

    // Create new plant with ID and user contributed flag
    const plantToAdd = {
      ...newPlant,
      id: `user-${Date.now()}`, // Generate unique ID
      isUserContributed: true, // Flag to identify user contributions
      dateAdded: new Date().toISOString(),
      uses: processedUses, // Ensure uses is an array
    };

    // Add to user contributed plants
    setUserContributedPlants((prev) => [...prev, plantToAdd]);

    // Reset form
    setNewPlant({
      id: "",
      scientific_name: "",
      common_name: "",
      urdu_name: "",
      family: "",
      genus: "",
      description: "",
      ideal_soil: "",
      watering: "",
      sunlight: "",
      uses: "",
      region: "",
    });

    // Show success message
    setFormSuccess(true);

    // Hide form after 2 seconds
    setTimeout(() => {
      setFormSuccess(false);
      setShowContributionForm(false);
    }, 3000);
  };

  return (
    <div className="plant-database-container">
      <h1 style={{ marginTop: "20px" }}>Plant Database & Information Hub</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <div
          className="search-input-container"
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for plants..."
            ref={searchInputRef}
            style={{
              width: "100%",
              padding: "15px 110px 15px 25px",
              border: "none",
              fontSize: "1rem",
              outline: "none",
              borderRadius: "50px",
            }}
          />
          <button
            type="submit"
            disabled={!searchTerm.trim() || loading}
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              bottom: "0",
              padding: "0 25px",
              background: "linear-gradient(135deg, #2a6f2a, #388e3c)",
              color: "white",
              border: "none",
              borderRadius: "0 50px 50px 0",
              cursor: "pointer",
              fontWeight: "600",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              opacity: !searchTerm.trim() || loading ? "0.7" : "1",
            }}
            onMouseOver={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #388e3c, #2a6f2a)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #2a6f2a, #388e3c)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Moved buttons section with updated styling */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "white",
          position: "sticky",
          top: "80px",
          zIndex: 100,
          borderBottom: "1px solid rgba(165, 214, 167, 0.3)",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
          className="search-history-btn"
          style={{
            height: "44px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #2a6f2a, #388e3c)",
            color: "white",
            border: "none",
            padding: "0 25px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: "500",
          }}
          onClick={() => setShowHistoryPopup(true)}
        >
          <FaHistory style={{ marginRight: "10px" }} /> Search History
        </button>

        <button
          type="button"
          style={{
            height: "44px",
            borderRadius: "6px",
            background:
              favorites.length > 0
                ? "linear-gradient(135deg, #e74c3c, #c0392b)"
                : "linear-gradient(135deg, #95a5a6, #7f8c8d)",
            color: "white",
            border: "none",
            padding: "0 25px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: "500",
          }}
          onClick={() => {
            setShowFavorites(true);
            setHasSearched(true);
            setSearchResults([]);
            setCategoryResults([]);
          }}
        >
          ❤️ My Favorites ({favorites.length})
        </button>
      </div>

      {/* Search History Popup */}
      {showHistoryPopup && (
        <div
          className="search-history-popup"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 950, // Higher than sticky buttons but lower than navbar
          }}
        >
          <div
            className="search-history-content"
            style={{
              position: "relative",
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              width: "350px", // Fixed width
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
              margin: "120px 30px 0 0", // Top and right margin
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "2px solid #e0f2e0",
                paddingBottom: "10px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.6rem",
                  color: "#2a6f2a",
                  margin: 0,
                  textAlign: "center",
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                Your Search History
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowHistoryPopup(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "#888",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  transition: "all 0.2s ease",
                  padding: 0,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                  e.currentTarget.style.color = "#333";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#888";
                }}
              >
                <FaTimes />
              </button>
            </div>

            {searchHistory.length > 0 ? (
              <>
                <div className="search-history-list">
                  {searchHistory.map((term, index) => (
                    <div
                      key={index}
                      className="history-list-item"
                      style={{
                        padding: "12px 15px",
                        marginBottom: "10px",
                        background: "#f5f5f5",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#333",
                        transition: "all 0.2s ease",
                        border: "1px solid #e0e0e0",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#e8f5e9";
                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#f5f5f5";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                      onClick={() => handleHistorySelect(term)}
                    >
                      <FaSearch
                        style={{
                          marginRight: "10px",
                          color: "#2a6f2a",
                        }}
                      />
                      {term}
                    </div>
                  ))}
                </div>
                <button
                  className="clear-history"
                  onClick={clearSearchHistory}
                  style={{
                    display: "block",
                    margin: "20px auto 0",
                    padding: "8px 20px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#d32f2f";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#f44336";
                  }}
                >
                  Clear History
                </button>
              </>
            ) : (
              <p
                className="no-history-msg"
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontStyle: "italic",
                  padding: "20px 0",
                  fontSize: "1rem",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                No search history yet
              </p>
            )}
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Show welcome message when no search has been performed and favorites not shown */}
      {!hasSearched && !showFavorites && (
        <div
          className="welcome-message"
          style={{
            width: "90%",
            maxWidth: "800px",
            margin: "40px auto",
            background: "white",
            boxShadow: "0 0 40px rgba(165, 214, 167, 0.15)",
            borderRadius: "15px",
            padding: "35px 25px",
            border: "1px solid #a5d6a7",
          }}
        >
          <h3>Welcome to our Plant Database</h3>
          <p>
            Search for any plant to learn about its characteristics, care
            instructions, and more.
          </p>

          <p
            style={{
              color: "#2a6f2a",
              fontWeight: "600",
              marginTop: "30px",
              marginBottom: "15px",
            }}
          >
            Explore these popular regional plants:
          </p>
          <div
            className="popular-searches"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              margin: "25px 0",
            }}
          >
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Neem")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Neem (نیم)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Holy Basil")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Tulsi (تلسی)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Rose")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Rose (گلاب)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Aloe Vera")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Aloe Vera (ایلو ویرا)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Mint")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Mint (پودینہ)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Turmeric")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Turmeric (ہلدی)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Ginger")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Ginger (ادرک)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Peepal Tree")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Peepal (پیپل)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Banana")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              Banana (کیلا)
            </span>
            <span
              className="search-pill"
              onClick={() => handleQuickSearch("Mango")}
              style={{
                background: "#f5f5f5",
                color: "#333",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #e0e0e0",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                margin: "5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {}}
            >
              Mango (آم)
            </span>
          </div>
        </div>
      )}

      {/* Plants by category section - shown only when not searching and favorites not shown */}
      {!hasSearched && !showFavorites && (
        <div
          className="plant-categories-container"
          style={{
            marginTop: "60px",
            borderTop: "2px solid #e0f2e0",
            paddingTop: "40px",
            // Remove maxWidth conflicting with width setting below
            margin: "60px auto 40px",
            background: "white",
            boxShadow: "0 0 40px rgba(165, 214, 167, 0.15)",
            borderRadius: "15px",
            padding: "35px 25px 45px",
            border: "1px solid #a5d6a7", // Changed to match the search-pill border style
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: "relative",
            overflow: "hidden",
            width: "90%",
            maxWidth: "800px", // Match the exact width of the popular plants section
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#2a6f2a",
              marginBottom: "30px",
              fontSize: "2rem",
              fontWeight: "700",
              position: "relative",
              paddingBottom: "15px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: "1",
              }}
            >
              Explore Plants by Category
            </span>
            <span
              style={{
                position: "absolute",
                height: "4px",
                width: "100px",
                background: "linear-gradient(90deg, #2a6f2a, #6fba6f)",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "4px",
              }}
            ></span>
          </h3>
          <p
            style={{
              textAlign: "center",
              maxWidth: "650px",
              margin: "0 auto 40px",
              color: "#555",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Discover perfect plants for specific needs and environments
          </p>
          <div
            className="plant-categories"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              margin: "25px 0",
            }}
          >
            {plantCategories.map((category) => (
              <span
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                style={{
                  background: "#f5f5f5",
                  color: "#333",
                  borderRadius: "30px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s, transform 0.3s",
                  margin: "8px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#e8f5e9";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#f5f5f5";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                className="category-pill"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* User Contribution Form - shown only when not searching and favorites not shown */}
      {!hasSearched && !showFavorites && (
        <div
          className="user-contribution-container"
          style={{
            marginTop: "60px",
            borderTop: "2px solid #e0f2e0",
            paddingTop: "40px",
            margin: "60px auto 40px",
            background: "white",
            boxShadow: "0 0 40px rgba(165, 214, 167, 0.15)",
            borderRadius: "15px",
            padding: "35px 25px 45px",
            border: "1px solid #a5d6a7",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: "relative",
            overflow: "hidden",
            width: "90%",
            maxWidth: "800px",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#2a6f2a",
              marginBottom: "30px",
              fontSize: "2rem",
              fontWeight: "700",
              position: "relative",
              paddingBottom: "15px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: "1",
              }}
            >
              Contribute to Our Plant Database
            </span>
            <span
              style={{
                position: "absolute",
                height: "4px",
                width: "100px",
                background: "linear-gradient(90deg, #2a6f2a, #6fba6f)",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "4px",
              }}
            ></span>
          </h3>
          <p
            style={{
              textAlign: "center",
              maxWidth: "650px",
              margin: "0 auto 20px",
              color: "#555",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Do you have knowledge about plants not in our database? Share your
            expertise with our community!
          </p>

          {formSuccess && (
            <div
              style={{
                background: "#e8f5e9",
                padding: "15px 20px",
                borderRadius: "8px",
                margin: "20px auto",
                textAlign: "center",
                color: "#2a6f2a",
                border: "1px solid #a5d6a7",
                maxWidth: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "1.1rem",
              }}
            >
              <FaLeaf />{" "}
              <span>Thank you! Your plant has been added to our database.</span>
            </div>
          )}

          {!showContributionForm && !formSuccess && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <button
                onClick={() => setShowContributionForm(true)}
                style={{
                  background: "linear-gradient(135deg, #2a6f2a, #388e3c)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px 25px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(0,0,0,0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
              >
                Add a New Plant to the Database
              </button>
            </div>
          )}

          {showContributionForm && (
            <form
              onSubmit={handleContributionSubmit}
              style={{ maxWidth: "600px", margin: "30px auto" }}
            >
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Common Name*:
                </label>
                <input
                  type="text"
                  name="common_name"
                  value={newPlant.common_name}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: formErrors.common_name
                      ? "1px solid #e74c3c"
                      : "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                  placeholder="e.g., Banana"
                />
                {formErrors.common_name && (
                  <span style={{ color: "#e74c3c", fontSize: "0.9rem" }}>
                    {formErrors.common_name}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Scientific Name*:
                </label>
                <input
                  type="text"
                  name="scientific_name"
                  value={newPlant.scientific_name}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: formErrors.scientific_name
                      ? "1px solid #e74c3c"
                      : "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                  placeholder="e.g., Musa paradisiaca"
                />
                {formErrors.scientific_name && (
                  <span style={{ color: "#e74c3c", fontSize: "0.9rem" }}>
                    {formErrors.scientific_name}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Urdu Name:
                </label>
                <input
                  type="text"
                  name="urdu_name"
                  value={newPlant.urdu_name}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                  placeholder="e.g., کیلا"
                />
              </div>

              <div
                style={{ display: "flex", gap: "15px", marginBottom: "15px" }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Family:
                  </label>
                  <input
                    type="text"
                    name="family"
                    value={newPlant.family}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                    }}
                    placeholder="e.g., Musaceae"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Genus:
                  </label>
                  <input
                    type="text"
                    name="genus"
                    value={newPlant.genus}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                    }}
                    placeholder="e.g., Musa"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Description*:
                </label>
                <textarea
                  name="description"
                  value={newPlant.description}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: formErrors.description
                      ? "1px solid #e74c3c"
                      : "1px solid #ddd",
                    fontSize: "1rem",
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                  placeholder="Describe the plant's characteristics, appearance, etc."
                />
                {formErrors.description && (
                  <span style={{ color: "#e74c3c", fontSize: "0.9rem" }}>
                    {formErrors.description}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Ideal Soil:
                </label>
                <input
                  type="text"
                  name="ideal_soil"
                  value={newPlant.ideal_soil}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                  placeholder="e.g., Rich, well-draining soil"
                />
              </div>

              <div
                style={{ display: "flex", gap: "15px", marginBottom: "15px" }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Watering:
                  </label>
                  <input
                    type="text"
                    name="watering"
                    value={newPlant.watering}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                    }}
                    placeholder="e.g., Regular, high water requirement"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Sunlight:
                  </label>
                  <input
                    type="text"
                    name="sunlight"
                    value={newPlant.sunlight}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                    }}
                    placeholder="e.g., Full sun"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Uses:
                </label>
                <input
                  type="text"
                  name="uses"
                  value={newPlant.uses}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                  placeholder="e.g., Edible, Fiber, Ornamental (comma separated)"
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Region:
                </label>
                <input
                  type="text"
                  name="region"
                  value={newPlant.region}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                  placeholder="e.g., South and Southeast Asia"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() => setShowContributionForm(false)}
                  style={{
                    background: "#f5f5f5",
                    color: "#333",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #2a6f2a, #388e3c)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 25px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  Submit Plant
                </button>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                * Required fields
              </p>
            </form>
          )}

          {userContributedPlants.length > 0 && (
            <div
              style={{
                marginTop: "40px",
                borderTop: "1px dashed #ddd",
                paddingTop: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  color: "#2a6f2a",
                  marginBottom: "15px",
                }}
              >
                Your Contributed Plants ({userContributedPlants.length})
              </h4>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                {userContributedPlants.map((plant) => (
                  <div
                    key={plant.id}
                    style={{
                      background: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "10px 15px",
                      fontSize: "0.95rem",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaLeaf color="#2a6f2a" size={14} /> {plant.common_name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Only show "No plants found" if a search was performed and no results */}
      {hasSearched &&
        searchResults.length === 0 &&
        categoryResults.length === 0 &&
        !showFavorites && (
          <div className="no-results">
            <p>No plants found matching "{searchTerm}".</p>
            <p>Try a different search term or browse our popular plants.</p>
            <button onClick={resetSearch} className="back-button">
              ← Back to Search
            </button>
          </div>
        )}

      {/* Show favorites */}
      {showFavorites && favorites.length > 0 && (
        <div>
          <div className="results-header">
            <h3>My Favorite Plants</h3>
            <button onClick={resetFavorites} className="back-button">
              ← Back to Search
            </button>
          </div>
          <div
            className="plant-list"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {favorites.map((plant) => (
              <div
                key={plant.id}
                className="plant-card"
                style={{
                  width: "450px",
                  maxWidth: "90%",
                  margin: "0 auto",
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Fixed incomplete boxShadow value
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                }}
                onClick={() => selectPlant(plant)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0, 0, 0, 0.1)";
                }}
              >
                <button
                  onClick={(e) => addToFavorites(plant, e)}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#e74c3c",
                    color: "white",
                    border: "1px solid #c0392b",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    zIndex: 2,
                  }}
                  aria-label="Remove from favorites"
                >
                  ❤️
                </button>
                {/* Plant details same as category results */}
                <h3
                  style={{
                    color: "#2a6f2a",
                    marginTop: "0",
                    borderBottom: "1px solid #e0f2e0",
                    paddingBottom: "10px",
                  }}
                >
                  {plant.common_name || plant.scientific_name}
                </h3>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
                >
                  <div style={{ flex: "1" }}>
                    <p>
                      <strong>Scientific Name:</strong> {plant.scientific_name}
                    </p>
                    {plant.urdu_name && (
                      <p>
                        <strong>Urdu Name:</strong> {plant.urdu_name}
                      </p>
                    )}
                    {plant.benefits && (
                      <p>
                        <strong>Benefits:</strong> {plant.benefits}
                      </p>
                    )}
                    {plant.maintenance && (
                      <p>
                        <strong>Maintenance:</strong> {plant.maintenance}
                      </p>
                    )}
                  </div>
                </div>
                {plant.watering && plant.sunlight && (
                  <p>
                    <strong>Care:</strong> {plant.watering} watering,{" "}
                    {plant.sunlight} light
                  </p>
                )}
                <p style={{ marginBottom: "0" }}>
                  <strong>Description:</strong> {plant.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show "No favorites" message when favorites view is empty */}
      {showFavorites && favorites.length === 0 && (
        <div className="no-results">
          <h3>You don't have any favorite plants yet</h3>
          <p>
            Browse plants and click the heart icon to add them to your
            favorites.
          </p>
          <button onClick={resetFavorites} className="back-button">
            ← Back to Search
          </button>
        </div>
      )}

      {/* Show category results */}
      {selectedCategory && categoryResults.length > 0 && !showFavorites && (
        <div>
          <div className="results-header">
            <h3>Plants for {selectedCategory.name}</h3>
            <button onClick={resetCategory} className="back-button">
              ← Back to Search
            </button>
          </div>
          <div
            className="plant-list"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {categoryResults.map((plant) => (
              <div
                key={plant.id}
                className="plant-card"
                style={{
                  width: "450px",
                  maxWidth: "90%",
                  margin: "0 auto",
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative", // Add this for positioning favorite button
                }}
                onClick={() => selectPlant(plant)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0, 0, 0, 0.1)";
                }}
              >
                <button
                  onClick={(e) => addToFavorites(plant, e)}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: isFavorite(plant.id) ? "#e74c3c" : "#f5f5f5",
                    color: isFavorite(plant.id) ? "white" : "#333",
                    border:
                      "1px solid " +
                      (isFavorite(plant.id) ? "#c0392b" : "#ddd"),
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    zIndex: 2,
                  }}
                  aria-label={
                    isFavorite(plant.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {isFavorite(plant.id) ? "❤️" : "🤍"}
                </button>
                <h3
                  style={{
                    color: "#2a6f2a",
                    marginTop: "0",
                    borderBottom: "1px solid #e0f2e0",
                    paddingBottom: "10px",
                  }}
                >
                  {plant.common_name || plant.scientific_name}
                </h3>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
                >
                  <div style={{ flex: "1" }}>
                    <p>
                      <strong>Scientific Name:</strong> {plant.scientific_name}
                    </p>
                    {plant.urdu_name && (
                      <p>
                        <strong>Urdu Name:</strong> {plant.urdu_name}
                      </p>
                    )}
                    <p>
                      <strong>Benefits:</strong> {plant.benefits}
                    </p>
                    <p>
                      <strong>Maintenance:</strong> {plant.maintenance}
                    </p>
                  </div>
                </div>
                {plant.watering && plant.sunlight && (
                  <p>
                    <strong>Care:</strong> {plant.watering} watering,{" "}
                    {plant.sunlight} light
                  </p>
                )}
                <p style={{ marginBottom: "0" }}>
                  <strong>Description:</strong> {plant.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show search results */}
      {searchResults.length > 0 && !showFavorites && (
        <div>
          <div className="results-header">
            <h3>Search Results for "{searchTerm}"</h3>
            <button onClick={resetSearch} className="back-button">
              ← Back to Search
            </button>
          </div>
          <div
            className="plant-list"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {searchResults.map((plant) => (
              <div
                key={plant.id}
                className="plant-card"
                style={{
                  width: "450px",
                  maxWidth: "90%",
                  margin: "0 auto",
                  padding: plant.isUserContributed
                    ? "70px 20px 20px 20px"
                    : "20px", // Add top padding if user contributed
                  position: "relative", // Add this for positioning favorite button
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => selectPlant(plant)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Updated user contributed indicator with verification note - more compact version */}
                {plant.isUserContributed && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      right: "0",
                      background: "rgba(255, 248, 225, 0.95)",
                      borderRadius: "12px 12px 0 0",
                      padding: "7px 15px", // Reduced padding
                      fontSize: "0.8rem", // Slightly smaller font
                      color: "#856404",
                      border: "1px solid #ffeeba",
                      borderBottom: "1px dashed #ffeeba",
                      display: "flex",
                      alignItems: "center", // Changed to center align
                      gap: "8px",
                      zIndex: 2,
                      width: "100%",
                    }}
                  >
                    <FaUser size={11} />
                    <div>
                      <span style={{ fontWeight: "500" }}>
                        User Contributed
                      </span>
                      {" - "}
                      <span style={{ fontSize: "0.75rem" }}>
                        Please verify independently
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => addToFavorites(plant, e)}
                  style={{
                    position: "absolute",
                    top: plant.isUserContributed ? "55px" : "15px", // Reduced from 75px to 55px
                    right: "15px",
                    background: isFavorite(plant.id) ? "#e74c3c" : "#f5f5f5",
                    color: isFavorite(plant.id) ? "white" : "#333",
                    border:
                      "1px solid " +
                      (isFavorite(plant.id) ? "#c0392b" : "#ddd"),
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    zIndex: 2,
                  }}
                  aria-label={
                    isFavorite(plant.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {isFavorite(plant.id) ? "❤️" : "🤍"}
                </button>

                <h3
                  style={{
                    color: "#2a6f2a",
                    marginTop: "0",
                    borderBottom: "1px solid #e0f2e0",
                    paddingBottom: "10px",
                  }}
                >
                  {plant.common_name ||
                    plant.scientific_name ||
                    "Unknown Plant"}
                </h3>

                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
                >
                  <div style={{ flex: "1" }}>
                    <p>
                      <strong>Scientific Name:</strong> {plant.scientific_name}
                    </p>
                    {plant.urdu_name && (
                      <p>
                        <strong>Urdu Name:</strong> {plant.urdu_name}
                      </p>
                    )}
                    {plant.benefits && (
                      <p>
                        <strong>Benefits:</strong> {plant.benefits}
                      </p>
                    )}
                    {plant.maintenance && (
                      <p>
                        <strong>Maintenance:</strong> {plant.maintenance}
                      </p>
                    )}
                  </div>
                </div>
                {plant.watering && plant.sunlight && (
                  <p>
                    <strong>Care:</strong> {plant.watering} watering,{" "}
                    {plant.sunlight} light
                  </p>
                )}
                <p style={{ marginBottom: "0" }}>
                  <strong>Description:</strong> {plant.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPlant && (
        <div className="plant-details-modal">
          <div className="plant-details-content">
            <button className="close-button" onClick={closeDetails}>
              ×
            </button>

            {/* Enhanced user contributed indicator in modal */}
            {selectedPlant.isUserContributed && (
              <div
                style={{
                  background: "rgba(255, 248, 225, 0.95)",
                  borderRadius: "5px",
                  padding: "8px 15px",
                  fontSize: "0.9rem",
                  color: "#856404",
                  border: "1px solid #ffeeba",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaUser />
                <div>
                  <span style={{ fontWeight: "600" }}>
                    User Contributed Plant
                  </span>
                  <p style={{ margin: "0", fontSize: "0.85rem" }}>
                    Please verify details independently before use.
                  </p>
                </div>
              </div>
            )}

            <h2>
              {selectedPlant.common_name || selectedPlant.scientific_name}
            </h2>
            <p>
              <strong>Scientific Name:</strong> {selectedPlant.scientific_name}
            </p>
            {selectedPlant.urdu_name && (
              <p>
                <strong>Urdu Name:</strong> {selectedPlant.urdu_name}
              </p>
            )}
            <p>
              <strong>Family:</strong>{" "}
              {selectedPlant.family_common_name || selectedPlant.family}
            </p>
            <p>
              <strong>Genus:</strong> {selectedPlant.genus}
            </p>
            {selectedPlant.description && (
              <p>
                <strong>Description:</strong> {selectedPlant.description}
              </p>
            )}
            {selectedPlant.ideal_soil && (
              <p>
                <strong>Ideal Soil:</strong> {selectedPlant.ideal_soil}
              </p>
            )}
            {selectedPlant.watering && (
              <p>
                <strong>Watering:</strong> {selectedPlant.watering}
              </p>
            )}
            {selectedPlant.sunlight && (
              <p>
                <strong>Sunlight:</strong> {selectedPlant.sunlight}
              </p>
            )}
            {selectedPlant.uses && (
              <p>
                <strong>Uses:</strong>{" "}
                {Array.isArray(selectedPlant.uses)
                  ? selectedPlant.uses.join(", ")
                  : selectedPlant.uses}
              </p>
            )}
            {selectedPlant.region && (
              <p>
                <strong>Region:</strong> {selectedPlant.region}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantDatabase;
