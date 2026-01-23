const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = process.env.NOBEL_API_BASE_URL;

const getPrizes = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/nobelPrizes`, { params });
    // Transform the complex API response into a clean list
    const cleanData = response.data.nobelPrizes.map(prize => ({
      year: prize.awardYear,
      category: prize.category?.en || 'Unknown',
      dateAwarded: prize.dateAwarded,
      prizeAmount: prize.prizeAmount,
      winners: prize.laureates ? prize.laureates.map(laureate => ({
        id: laureate.id,
        name: laureate.knownName?.en || laureate.orgName?.en || 'Unknown',
        motivation: laureate.motivation?.en || 'No citation available',
        share: laureate.portion
      })) : []
    }));
    return cleanData;
  } catch (error) {
    console.error('Error fetching prizes:', error.message);
    throw error;
  }
};

const getLaureates = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/laureates`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching laureates:', error.message);
    throw error;
  }
};

module.exports = {
  getPrizes,
  getLaureates,
};
