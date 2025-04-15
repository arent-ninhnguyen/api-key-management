describe('Dashboard', () => {
  beforeEach(() => {
    // Set up auth mock
    cy.visit('/');
    cy.setAuth();
    
    // Mock API stats
    cy.intercept('GET', '**/api/stats', {
      statusCode: 200,
      body: {
        totalKeys: 2,
        activeKeys: 2,
        totalUsage: 3650
      }
    }).as('getStats');
    
    // Visit homepage
    cy.visit('/');
  });

  it('loads the homepage', () => {
    // Basic test to ensure the page loads
    cy.contains('API Management').should('exist');
  });

  it('can navigate to dashboard', () => {
    // Test that navigation works
    cy.contains('Manage API Keys').click();
    cy.url().should('include', '/dashboards');
  });
}); 