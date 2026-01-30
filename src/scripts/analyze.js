const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const config = require('../utils/config');
const logger = require('../utils/logger');
const nobelService = require('../services/nobelService');

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
};

const analyzeData = async () => {
  logger.info('Starting Nobel Prize Data Analysis...');
  
  // Interactive Wizard if no args provided
  if (!config.year && !config.category) {
      console.log('\n--- Interactive Mode ---');
      const yearInput = await askQuestion('Enter Year (leave blank for all): ');
      if (yearInput.trim()) config.year = yearInput.trim();

      const catInput = await askQuestion('Enter Category (phy, che, med, lit, peace, eco - leave blank for all): ');
      if (catInput.trim()) config.category = catInput.trim();

      const formatInput = await askQuestion('Output Format (json/csv - default json): ');
      if (formatInput.trim()) config.format = formatInput.trim().toLowerCase();
      console.log('------------------------\n');
  }

  logger.debug(`Configuration: ${JSON.stringify(config, null, 2)}`);

  try {
    // 1. Prepare Parameters
    const params = {};
    if (config.year) params.nobelPrizeYear = config.year;
    if (config.category) params.nobelPrizeCategory = config.category;
    
    // Always fetch a decent amount for analysis if not specified.
    if (!config.year && !config.category) {
        params.limit = 100; // Fetch more data for general analysis
    }

    logger.info(`Fetching data from API... Params: ${JSON.stringify(params)}`);
    
    // 2. Retrieve Data
    const prizes = await nobelService.getPrizes(params);
    logger.info(`Successfully retrieved ${prizes.length} prize records.`);

    // 3. Process & Evaluate
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

    // 4. Visualize (Console Output)
    console.log('\n---  Analysis Report ---');
    console.log(`Total Prizes Analyzed: ${stats.totalPrizes}`);
    console.log(`Total Laureates:       ${stats.totalLaureates}`);
    console.log(`Average Prize Amount:  ${stats.averagePrizeAmount.toLocaleString()} SEK`);
    console.log('\nCategory Distribution:');
    console.table(stats.prizesByCategory);
    console.log('--------------------------\n');

    // 5. Store Results
    await fs.ensureDir(config.outputDir);

    if (config.format === 'csv') {
        const headers = ['Year', 'Category', 'Date Awarded', 'Prize Amount', 'Winners'];
        const rows = prizes.map(p => {
            const winners = p.winners.map(w => w.name).join('; ');
            return `${p.year},${p.category},${p.dateAwarded},${p.prizeAmount},"${winners}"`;
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const outputFilename = config.outputFile.replace('.json', '.csv');
        const outputPath = path.resolve(config.outputDir, outputFilename);
        
        await fs.writeFile(outputPath, csvContent);
        logger.info(`Analysis complete. Results saved to: ${outputPath}`);
    } else {
        const outputPath = path.resolve(config.outputDir, config.outputFile);
        await fs.writeJson(outputPath, { 
          metadata: {
            timestamp: new Date().toISOString(),
            configUsed: params
          },
          stats, 
          rawData: prizes 
        }, { spaces: 2 });
        logger.info(`Analysis complete. Results saved to: ${outputPath}`);
    }

  } catch (error) {
    logger.error(`Analysis failed: ${error.message}`);
    process.exit(1);
  }
};

analyzeData();
