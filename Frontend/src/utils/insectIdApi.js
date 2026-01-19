const INSECT_ID_API_KEY = "rQgCJiNKpiHKQkjsE33BOssZ406gbEepIb7SVtn52IzVw3HRIl";
const INSECT_ID_API_URL = "https://insect.kindwise.com/api/v1";

// Common insects database
const mockInsectDatabase = [
  {
    name: "Ladybug (Coccinellidae)",
    name_urdu: "شپشک خور بھونڈی",
    probability: 0.95,
    taxonomy: {
      scientific_name: "Coccinella septempunctata",
      family: "Coccinellidae",
    },
    common_names: ["Seven-spotted Ladybug", "Lady Beetle"],
    description: {
      value:
        "Beneficial garden insect that feeds on aphids and other pest insects.",
      urdu: "باغ کے لیے فائدہ مند کیڑا جو ایفڈز اور دیگر نقصان دہ کیڑوں کو کھاتا ہے۔",
    },
    hazards: [],
    cure_needed: false,
    treatment: {
      value:
        "No treatment needed - beneficial insect that helps control garden pests naturally.",
      urdu: "کوئی علاج درکار نہیں - یہ باغ کے نقصان دہ کیڑوں کو قدرتی طور پر قابو کرتا ہے۔",
      steps: [
        "Protect ladybugs when found",
        "Avoid using pesticides",
        "Plant flowers to attract them",
      ],
      steps_urdu: [
        "شپشک خور بھونڈی کو پایا جائے تو اس کی حفاظت کریں",
        "کیڑے مار ادویات کے استعمال سے گریز کریں",
        "انہیں متوجہ کرنے کے لیے پھول لگائیں",
      ],
    },
  },
  {
    name: "Aphid",
    name_urdu: "تیلا",
    probability: 0.92,
    taxonomy: {
      scientific_name: "Aphidoidea",
      family: "Aphididae",
    },
    common_names: ["Plant Lice", "Greenfly"],
    description: {
      value:
        "Small sap-sucking insects that damage plants and spread diseases.",
      urdu: "چھوٹے کیڑے جو پودوں کا رس چوستے ہیں اور بیماریاں پھیلاتے ہیں۔",
    },
    hazards: ["Plant damage", "Disease vector"],
    cure_needed: true,
    treatment: {
      value: "Natural and chemical control methods available",
      urdu: "قدرتی اور کیمیائی کنٹرول کے طریقے دستیاب ہیں",
      steps: [
        "Spray with neem oil solution",
        "Introduce ladybugs as natural predators",
        "Use insecticidal soap if needed",
      ],
      steps_urdu: [
        "نیم کے تیل کا محلول سپرے کریں",
        "قدرتی شکاری کے طور پر شپشک خور بھونڈی کا استعمال کریں",
        "ضرورت پڑنے پر کیڑے مار صابن استعمال کریں",
      ],
    },
  },
];

/**
 * Identifies insects from an image using the API
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise} - Promise containing the identification results
 */
export const identifyInsect = async (imageFile) => {
  // Validate file input
  if (!imageFile || !imageFile.type.startsWith("image/")) {
    throw new Error("Please provide a valid image file");
  }

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return random insect from our database
    return {
      suggestions: [
        mockInsectDatabase[
          Math.floor(Math.random() * mockInsectDatabase.length)
        ],
      ],
    };
  } catch (error) {
    console.error("Error identifying insect:", error);
    throw error;
  }
};

/**
 * Get detailed information about an insect based on ID
 * @param {string} insectId - Insect ID from identification results
 * @returns {Promise} - Promise containing insect details
 */
export const getInsectDetails = async (insectId) => {
  try {
    const response = await fetch(`${INSECT_ID_API_URL}/insects/${insectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": INSECT_ID_API_KEY, // ✅ API requires Api-Key header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${
          errorText || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching insect details:", error);
    throw error;
  }
};

/**
 * Convert file to base64 format
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise containing the base64 string with prefix
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file); // Keep full DataURL
  });
};

export default {
  identifyInsect,
  getInsectDetails,
};
