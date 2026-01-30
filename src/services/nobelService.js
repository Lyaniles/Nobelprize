const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../utils/config');

const BASE_URL = config.apiBaseUrl;
const cache = new NodeCache({ stdTTL: config.cacheTTL || 3600 });

const getPrizes = async (params = {}) => {
  const cacheKey = `prizes_${JSON.stringify(params)}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    console.log('Returning cached data for prizes');
    return cachedData;
  }

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

    cache.set(cacheKey, cleanData);
    return cleanData;
  } catch (error) {
    console.error('Error fetching prizes:', error.message);
    throw error;
  }
};

const getLaureates = async (params = {}) => {
  const cacheKey = `laureates_${JSON.stringify(params)}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log('Returning cached data for laureates');
    return cachedData;
  }

  try {
    const response = await axios.get(`${BASE_URL}/laureates`, { params });
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching laureates:', error.message);
    throw error;
  }
};

const getStatistics = async (params = {}) => {
  try {
    // Default to a higher limit for stats if not specified to get a good sample
    if (!params.limit) params.limit = 100;

    const prizes = await getPrizes(params);

    const stats = {
      totalPrizes: prizes.length,
      prizesByCategory: {},
      totalLaureates: 0,
      totalPrizeAmount: 0,
      averagePrizeAmount: 0
    };

    prizes.forEach(prize => {
      // Count by Category
      const cat = prize.category;
      stats.prizesByCategory[cat] = (stats.prizesByCategory[cat] || 0) + 1;

      // Count Laureates
      stats.totalLaureates += prize.winners ? prize.winners.length : 0;

      // Sum Amount
      stats.totalPrizeAmount += prize.prizeAmount || 0;
    });

    if (stats.totalPrizes > 0) {
      stats.averagePrizeAmount = Math.round(stats.totalPrizeAmount / stats.totalPrizes);
    }

    return stats;
  } catch (error) {
    console.error('Error generating statistics:', error.message);
    throw error;
  }
};

module.exports = {
  getPrizes,
  getLaureates,
  getStatistics,
};
