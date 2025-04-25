// Custom commands for Cypress testing
import { encode } from 'next-auth/jwt';

// Example of a custom command
Cypress.Commands.add('mockApi', (route, response) => {
  cy.intercept(route, {
    statusCode: 200,
    body: response
  });
});

// Custom command to log in programmatically using next-auth session cookie
Cypress.Commands.add("login", () => {
  // Check if NEXTAUTH_SECRET is available
  const secret = Cypress.env("NEXTAUTH_SECRET");
  if (!secret) {
    throw new Error(
      "NEXTAUTH_SECRET environment variable is not set. Please ensure it is available to Cypress."
    );
  }

  // Define a mock user object (adjust details as needed)
  const user = {
    name: "Test User",
    email: "test@example.com",
    // Add other user properties if your app uses them, e.g., id, image
    sub: "test-user-id-123", // The 'sub' property is often used for user ID
  };

  // Define session expiry (e.g., 30 days from now)
  const sessionExpiry = new Date();
  sessionExpiry.setDate(sessionExpiry.getDate() + 30);

  // Encode the session token
  cy.wrap(encode({ token: user, secret, maxAge: 30 * 24 * 60 * 60 })) // maxAge in seconds
    .then((encodedToken) => {
      // Set the session cookie
      // Use __Secure- prefix if your app runs on HTTPS, otherwise use standard name
      const cookieName = Cypress.config("baseUrl").startsWith("https")
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

      cy.setCookie(cookieName, encodedToken, {
        domain: new URL(Cypress.config("baseUrl")).hostname,
        path: "/",
        secure: Cypress.config("baseUrl").startsWith("https"),
        httpOnly: true, // Typically httpOnly
        expires: sessionExpiry.getTime() / 1000, // Cypress expects expiry in seconds
      });

      // Optional: Visit the base URL after setting the cookie to ensure 
      // the browser registers it properly before visiting protected pages.
      // cy.visit('/'); 
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