describe('API Key Management', () => {
  beforeEach(() => {
    // Visit the page and set up mocks first
    cy.visit('/');
    
    // Setup mocks after visit to ensure they work properly
    cy.setAuth();
    
    // Mock API keys data
    cy.intercept('GET', '**/rest/v1/api_keys**', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Development Key',
          key: 'ninh-dev123456789',
          status: 'Active',
          usage: 150,
          usage_limit: true,
          limit_value: 1000,
          created_at: '2023-09-25T10:00:00Z'
        },
        {
          id: '2',
          name: 'Production Key',
          key: 'ninh-prod987654321',
          status: 'Active',
          usage: 3500,
          usage_limit: true,
          limit_value: 10000,
          created_at: '2023-08-15T14:30:00Z'
        }
      ]
    }).as('getApiKeys');
    
    // Visit the dashboards page
    cy.visit('/dashboards');
  });

  it('loads the dashboard page', () => {
    // Basic test to ensure the page loads
    cy.contains('API Keys').should('exist');
  });

  it('mocks API calls correctly', () => {
    // Wait for the API keys request to complete
    cy.wait('@getApiKeys');
    
    // Check if our intercept is working
    cy.get('@getApiKeys').its('response.body').should('have.length', 2);
  });
}); 