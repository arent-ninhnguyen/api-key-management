const { defineConfig } = require('cypress');
require('dotenv').config({ path: '.env.local' });

module.exports = defineConfig({
  projectId: 'j3h945',
  env: {
    // You could put non-sensitive browser vars here
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Load environment variables from .env.local using the correct path
      const dotenvResult = require('dotenv').config({ path: '.env.local', override: true });
      
      // Log the result of dotenv loading
      if (dotenvResult.error) {
        console.error("Error loading .env.local file:", dotenvResult.error);
      } else {
        console.log(".env.local file loaded successfully. Parsed variables:", dotenvResult.parsed);
      }

      // Pass the NEXTAUTH_SECRET to Cypress env
      config.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
      console.log(`NEXTAUTH_SECRET read from process.env: ${process.env.NEXTAUTH_SECRET ? '******' : 'Not Found'}`); // Log if secret is found
      console.log(`NEXTAUTH_SECRET set in config.env: ${config.env.NEXTAUTH_SECRET ? '******' : 'Not Found'}`);

      // Make sure to return the config object
      return config;
    },
  },
  
  // Configure retries for flaky tests
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Video recording settings
  video: true,
  screenshotOnRunFailure: true,
}); 