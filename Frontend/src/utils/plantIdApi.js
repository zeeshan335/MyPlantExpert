const PLANT_ID_API_KEY = "YOUR_API_KEY"; // Replace with your actual Plant.id API key
const PLANT_ID_API_URL = "https://plant.id/api/v3";

/**
 * Identifies plants from an image using the Plant.id API
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise} - Promise containing the identification results
 */
export const identifyPlant = async (imageFile) => {
  // Validate file
  if (!imageFile || !imageFile.type.startsWith("image/")) {
    throw new Error("Please provide a valid image file");
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    const response = await fetch(`${PLANT_ID_API_URL}/identification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PLANT_ID_API_KEY,
      },
      body: JSON.stringify({
        images: [base64Image],
        organs: ["leaf", "flower", "fruit", "bark", "habit"],
        // Include additional parameters as needed
        plant_language: "en",
        plant_details: [
          "common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
          "synonyms",
          "edible_parts",
          "watering",
          "propagation_methods",
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Plant identification failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error;
  }
};

/**
 * Get detailed information about a plant based on ID
 * @param {string} plantId - Plant ID from identification results
 * @returns {Promise} - Promise containing plant details
 */
export const getPlantDetails = async (plantId) => {
  try {
    const response = await fetch(`${PLANT_ID_API_URL}/plants/${plantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PLANT_ID_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get plant details: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching plant details:", error);
    throw error;
  }
};

/**
 * Convert file to base64 format
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise containing the base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default {
  identifyPlant,
  getPlantDetails,
};
