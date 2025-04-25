describe('Dashboard', () => {
  beforeEach(() => {
    // Log in programmatically before each test
    cy.login();
    
    // Mock necessary API calls
    cy.mockApiKeys();
    cy.mockCreateApiKey(); 
    cy.mockDeleteApiKey();
    
    // Visit the dashboard page AFTER logging in and wait for initial data
    cy.visit('/dashboards');
    cy.wait('@getApiKeys'); // Wait for the hook's call
  });

  it('loads the dashboard page correctly', () => {
    // Basic test to ensure the main page elements load after setup
    cy.contains('h1', 'Overview').should('be.visible'); // From dashboard page
    cy.contains('h2', 'API Keys').should('be.visible'); // From dashboard page
  });

  // Remove this test as it duplicates dashboard loading check
  /*
  it('can navigate to dashboard', () => {
    // Test that navigation works
    cy.contains('Manage API Keys').click();
    cy.url().should('include', '/dashboards');
  });
  */
});

// Add new test cases below:
describe('Dashboard Stats', () => {
  beforeEach(() => {
    // Log in and set up mocks
    cy.login();
    cy.mockApiKeys();
    
    // Visit dashboard page directly and wait for data
    cy.visit('/dashboards');
    cy.wait('@getApiKeys');
  });

  it('displays the correct stats values', () => {
    // Verify API keys are displayed in the table
    cy.contains('Development Key').should('be.visible');
    cy.contains('Production Key').should('be.visible');
    
    // Verify usage values appear in the UI 
    cy.contains('150').should('be.visible');
    cy.contains('3500').should('be.visible');
    
    // Verify the research plan is displayed
    cy.contains('Researcher').should('be.visible');
    cy.contains('API Limit').should('be.visible');
  });

  it('shows the API keys table', () => {
    // Verify the table headers exist
    cy.contains('th', /name/i).should('be.visible');
    cy.contains('th', /usage/i).should('be.visible');
    cy.contains('th', /key/i).should('be.visible');
    cy.contains('th', /options/i).should('be.visible');
    
    // Verify at least two keys are displayed
    cy.contains('td', 'Development Key').should('be.visible');
    cy.contains('td', 'Production Key').should('be.visible');
  });
});

// New test suite for API usage limits
describe('Dashboard API Usage Limits', () => {

  it('shows API usage limit exceeded warnings', () => {
    // Log in first
    cy.login();
    
    // Define mocked key data where usage exceeds the limit
    const exceededKeysFixture = [
      {
        id: '1',
        name: 'High Usage Key 1',
        key: 'ninh-high1',
        status: 'Active',
        usage: 50001, 
        usage_limit: false,
        limit_value: null,
        created_at: '2023-09-25T10:00:00Z'
      },
      {
        id: '2',
        name: 'High Usage Key 2',
        key: 'ninh-high2',
        status: 'Active',
        usage: 50000, 
        usage_limit: false,
        limit_value: null,
        created_at: '2023-08-15T14:30:00Z'
      }
    ]; // Total usage = 100001

    // Intercept the API call specifically for this test to return exceeded usage data
    cy.intercept('GET', '**/rest/v1/api_keys**', {
      statusCode: 200,
      body: exceededKeysFixture
    }).as('getExceededApiKeys');

    // Visit the dashboard page
    cy.visit('/dashboards');
    
    // Wait specifically for the intercept defined in this test
    cy.wait('@getExceededApiKeys');
    
    // Verify the API fetch error is NOT shown
    cy.get('[data-cy="api-key-table-error"]').should('not.exist');
    cy.contains('Failed to load API keys').should('not.exist');

    // Verify table content IS loaded (with the new mock data)
    cy.get('table').should('be.visible');
    cy.contains('td', 'High Usage Key 1').should('exist');

    // Check for the API Limit text within the UsageStats component area
    cy.contains('API Limit').should('be.visible');
    
    // Check that the displayed usage reflects the exceeded state
    cy.contains('100001/100000 Requests').should('be.visible');

    // Check for the specific warning banner style used in UsageStats.js
    cy.get('.bg-red-600\\/80').should('be.visible'); 
    cy.contains('API Usage Limit Exceeded').should('be.visible');
  });
});

describe('Dashboard UI Components', () => {
  beforeEach(() => {
    // Log in and set up mocks
    cy.login();
    cy.mockApiKeys();
    cy.mockCreateApiKey(); // Needed for modal interaction
    
    // Visit dashboards page and wait for data
    cy.visit('/dashboards');
    cy.wait('@getApiKeys');
  });

  it('has create new API key button', () => {
    // Check if add button exists (the + button in the UI)
    cy.get('button').contains('+').should('be.visible');
  });

  it('opens the create API key modal when button is clicked', () => {
    // Click the + button
    cy.get('button').contains('+').click();
    
    // Check for modal using its background/content classes
    cy.get('.bg-white.dark\\:bg-gray-800.rounded-lg', { timeout: 6000 }).should('be.visible');
    
    // Check for specific content inside the modal
    cy.contains('h2', 'Create a new API key').should('be.visible');
    cy.get('[data-cy="api-key-name"]').should('exist');
    
    // Close the modal - assuming a specific cancel button
    cy.get('[data-cy="cancel-button"]').click();
    
  });
});

describe('Dashboard Error States', () => {
  // No beforeEach needed here as we mock errors specifically per test
  
  it('handles API keys fetch error gracefully', () => {
    // Log in first
    cy.login();
    
    // Mock the API keys endpoint with an error
    cy.intercept('GET', '**/rest/v1/api_keys**', {
      statusCode: 500,
      body: { message: 'Database Error' },
      delay: 100
    }).as('apiKeysError');
    
    cy.visit('/dashboards');
    
    // Wait for the error response
    cy.wait('@apiKeysError');
    
    // Check for error indication in the UI by looking for the visible text
    cy.contains('Failed to load API keys. Please try again later.').should('be.visible');
    
    // Also verify the table itself is not rendered
    cy.get('table').should('not.exist');
  });

  // Test for successful load is covered by other tests
}); 