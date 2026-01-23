const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Load environment variables
dotenv.config();

// Load Default Config
const defaultConfigPath = path.join(__dirname, '../../config/default.json');
const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));

// Parse Command Line Arguments
const argv = yargs(hideBin(process.argv))
  .option('year', { type: 'number', description: 'Filter by year' })
  .option('category', { type: 'string', description: 'Filter by category' })
  .option('logLevel', { type: 'string', description: 'Set logging level' })
  .option('outputFile', { type: 'string', description: 'Output filename' })
  .help()
  .argv;

// Helper to resolve precedence: CLI > Env > Default
const getSetting = (key) => {
  // 1. CLI Argument
  if (argv[key] !== undefined) return argv[key];
  
  // 2. Environment Variable (Convert keys like 'apiBaseUrl' to 'NOBEL_API_BASE_URL' if standard naming is used, 
  // or just look for specific overrides. For simplicity, we'll map specific ones).
  const envMap = {
    'apiBaseUrl': 'NOBEL_API_BASE_URL',
    'logLevel': 'LOG_LEVEL',
    'outputDir': 'OUTPUT_DIR'
  };
  
  const envKey = envMap[key] || key.toUpperCase();
  if (process.env[envKey] !== undefined) return process.env[envKey];

  // 3. Default Config
  return defaultConfig[key];
};

// Construct Final Configuration Object
const config = {
  apiBaseUrl: getSetting('apiBaseUrl'),
  outputDir: getSetting('outputDir'),
  outputFile: getSetting('outputFile'),
  logLevel: getSetting('logLevel'),
  year: getSetting('year'),
  category: getSetting('category'),
};

module.exports = config;
