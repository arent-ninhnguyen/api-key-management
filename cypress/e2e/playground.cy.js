describe('API Playground', () => {
  beforeEach(() => {
    // Mock API key validation
    cy.intercept('POST', '**/rest/v1/rpc/validate_api_key', {
      statusCode: 200,
      body: true
    }).as('validateApiKey');
    
    // Visit playground
    cy.visit('/playground');
  });

  it('loads the playground page', () => {
    // Basic test to ensure the page loads
    cy.contains('API').should('exist');
  });

  it('allows entering an API key', () => {
    // Test that the input field works
    cy.get('input[placeholder*="API key"]').type('test-key-12345');
    cy.get('input[placeholder*="API key"]').should('have.value', 'test-key-12345');
  });
}); 