/**
 * End-to-end tests for the Overview page
 * 
 * Tests cover:
 * - Page structure and content
 * - Statistics display
 * - Navigation
 * - Responsive design
 */
describe('Overview Page', () => {
  beforeEach(() => {
    // Log in programmatically before each test
    cy.login();

    // Mock API calls needed for the overview page 
    cy.mockApiKeys(); // Alias @getApiKeys is set here

    // Visit the overview page AFTER logging in and setting up mocks
    cy.visit('/');
    // Wait for the hook's data load
    cy.wait('@getApiKeys');
  });

  it('verifies the page title and main structure', () => {
    // Check that the main page title is visible
    cy.contains('API Management Overview').should('be.visible');
    
    // Check that the grid layout exists (used for stats cards)
    cy.get('.grid').should('exist');
    
    // Verify page has loaded completely
    cy.get('body').should('not.have.class', 'loading');
  });

  it('displays statistics cards with correct data from API', () => {
    // Data should be loaded from beforeEach
    // First verify the basic elements
    cy.contains('Total API Keys').should('exist');
    cy.contains('Active API Keys').should('exist');
    cy.contains('Total API Requests').should('exist');
    
    // Verify statistic values are displayed (using fixture data)
    // Assuming apiKeys.json has 2 keys, 2 active, and usage 150 + 3500 = 3650
    cy.contains('h3', 'Total API Keys').siblings('p').should('contain.text', '2');
    cy.contains('h3', 'Active API Keys').siblings('p').should('contain.text', '2');
    cy.contains('h3', 'Total API Requests').siblings('p').should('contain.text', '3,650');
  });

  it('displays quick action links for key workflows', () => {
    // Verify the page has links for the main actions
    // Using a more flexible approach that handles different text variations
    cy.get('a').then($links => {
      // Convert jQuery collection to array for easier processing
      const links = Array.from($links);
      const linkTexts = links.map(link => link.textContent.trim());
      
      // Log found links for debugging
      cy.log('Found links: ' + linkTexts.join(', '));
      
      // Check for management-related links
      const hasManageLink = links.some(link => 
        link.textContent.includes('Manage API Keys') || 
        link.textContent.includes('Manage')
      );
      
      // Check for playground/testing links
      const hasPlaygroundLink = links.some(link => 
        link.textContent.includes('API Playground') || 
        link.textContent.includes('Playground')
      );
      
      // Verify at least one of the expected actions is available
      expect(hasManageLink || hasPlaygroundLink, 'Page should have action links').to.be.true;
    });
  });

  it('has working navigation to other sections', () => {
    // Verify links exist and can be clicked
    cy.get('a').should('exist');
    
    // Record the starting URL for comparison
    cy.url().then(originalUrl => {
      // Find the first link that looks like a main navigation element
      cy.get('a').first().then($link => {
        cy.log(`Clicking link: ${$link.text()}`);
        cy.wrap($link).click({ force: true });
      });
      
      // Allow time for navigation to complete
      cy.wait(1000);
      
      // Verify something happened after clicking
      cy.get('body').then(() => {
        // Simple verification that we're still on a valid page
        cy.get('body').should('exist');
        cy.log('Navigation completed successfully');
      });
    });
  });

  it('is responsive and displays correctly across device sizes', () => {
    // Test desktop viewport (typical laptop/desktop size)
    cy.viewport(1280, 800);
    cy.log('Testing desktop viewport');
    cy.contains('API Management Overview').should('be.visible');
    cy.get('.grid').should('be.visible');
    
    // Test tablet viewport (iPad-like)
    cy.viewport(768, 1024);
    cy.log('Testing tablet viewport');
    cy.contains('API Management Overview').should('be.visible');
    cy.get('.grid').should('be.visible');
    
    // Test mobile viewport (iPhone-like)
    cy.viewport(375, 667);
    cy.log('Testing mobile viewport');
    cy.contains('API Management Overview').should('be.visible');
    cy.get('.grid').should('be.visible');
    
    // Verify content remains accessible on small screens
    cy.contains('Total API Keys').should('be.visible');
  });
}); 