const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'j3h945',
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
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