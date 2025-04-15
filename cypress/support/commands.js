// Custom commands for Cypress testing

// Example of a custom command
Cypress.Commands.add('mockApi', (route, response) => {
  cy.intercept(route, {
    statusCode: 200,
    body: response
  });
});

// Utility function to set authentication in localStorage
Cypress.Commands.add('setAuth', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'fake-token',
      refresh_token: 'fake-refresh',
      expires_at: Date.now() + 3600000
    }));
  });
});

// Mock API keys request
Cypress.Commands.add('mockApiKeys', () => {
  cy.intercept('GET', '**/rest/v1/api_keys**', {
    statusCode: 200,
    fixture: 'apiKeys.json'
  }).as('getApiKeys');
});

// Mock create API key request
Cypress.Commands.add('mockCreateApiKey', () => {
  cy.intercept('POST', '**/rest/v1/api_keys**', (req) => {
    const newKey = {
      id: 'new-key-123',
      name: req.body.name,
      key: 'ninh-testkey987654321',
      status: 'Active',
      usage: 0,
      usage_limit: req.body.usage_limit,
      limit_value: req.body.limit_value,
      created_at: new Date().toISOString()
    };
    
    req.reply({
      statusCode: 201,
      body: newKey
    });
  }).as('createApiKey');
});

// Mock delete API key request
Cypress.Commands.add('mockDeleteApiKey', () => {
  cy.intercept('DELETE', '**/rest/v1/api_keys**', {
    statusCode: 200,
    body: {}
  }).as('deleteApiKey');
});

// Mock validate API key request
Cypress.Commands.add('mockValidateApiKey', (isValid = true) => {
  cy.intercept('POST', '**/rest/v1/rpc/validate_api_key', {
    statusCode: 200,
    body: isValid
  }).as('validateApiKey');
}); 