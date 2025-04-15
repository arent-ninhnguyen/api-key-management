// ***********************************************************
// This file is processed and loaded automatically before your test files.
// ***********************************************************

// Import Testing Library commands
import '@testing-library/cypress/add-commands';

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Mock API call failures to prevent uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  return false;
}); 