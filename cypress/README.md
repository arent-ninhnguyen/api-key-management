# API Key Management - Cypress Tests

This directory contains Cypress tests for the API Key Management application. The tests are organized by feature and verify the functionality of the API key creation, viewing, editing, deletion, and copying capabilities.

## Test Organization

The tests are organized into several test suites:

1. **Basic API Key Management**
   - Tests basic dashboard loading and API key display
   - Verifies that API mocks are working correctly
   - Checks visibility toggles for API keys

2. **API Key Creation**
   - Tests opening the create API key modal
   - Verifies successful API key creation
   - Tests form validation on the creation modal
   - Handles error cases during API key creation

3. **API Key Editing**
   - Tests opening the edit modal with correct data
   - Verifies successful API key updates
   - Tests form validation during editing
   - Handles error cases during API key editing

4. **API Key Deletion**
   - Tests opening the delete confirmation modal
   - Verifies the cancellation workflow
   - Tests successful API key deletion
   - Handles error cases during deletion

5. **API Key Copying**
   - Tests copying API keys from the table
   - Tests copying newly created API keys
   - Verifies clipboard integration
   - Handles clipboard errors gracefully

## Test Data

Test data is provided via:

- Cypress fixtures (`apiKeys.json`) for consistent test data
- Network mocks for API interactions
- Stubs for browser APIs like clipboard

## Running Tests

To run all tests:

```bash
npx cypress run
```

To open Cypress Test Runner:

```bash
npx cypress open
```

## Troubleshooting Failed Tests

When tests fail, follow these debugging steps:

1. **Check selector mismatches**: Ensure that the selectors in tests match what's in the actual components. The tests use `data-cy` attributes which should align with the component implementation.

2. **Use more resilient selectors**: When appropriate, use text content selectors (`cy.contains()`) or combine multiple approaches for more resilient tests.

3. **API endpoint verification**: Ensure that the API endpoints being mocked match what the application is actually using.

4. **Network request timing**: Add proper `cy.wait()` commands after actions that trigger network requests to ensure the application has time to process responses.

5. **Error state handling**: Build flexibility into error state assertions by checking for text content rather than specific elements.

## Recent Test Fixes

The tests were recently updated to fix several issues:

1. **Selector updates**: Updated selectors to match the actual component attributes
   - Changed `[data-cy="api-key-name-input"]` to `[data-cy="api-key-name"]`
   - Changed `[data-cy="api-key-usage-input"]` to `[data-cy="usage-limit-value"]`
   - Changed `[data-cy="api-key-submit-button"]` to `[data-cy="save-key-button"]`

2. **More flexible assertions**: Added alternative assertion strategies
   - Using text content checks with `cy.contains()`
   - Checking for visible elements that indicate success/error states
   - Fallback assertions when specific elements aren't found

3. **API mocking improvements**: Added error handling for API mocks and more consistent response structures

4. **Resilient element selection**: Using more robust targeting to find elements
   - Combining `cy.get()` and `cy.contains()` for better targeting
   - Using DOM relationships (parents, within) to find related elements

## Naming Conventions

The tests use consistent data attribute selectors (`data-cy`) to target elements. These selectors are prefixed with appropriate feature names to make the tests more maintainable:

- `[data-cy="api-key-row"]` - API key table rows
- `[data-cy="api-key-name"]` - Name input field
- `[data-cy="usage-limit-checkbox"]` - Usage limit checkbox
- `[data-cy="usage-limit-value"]` - Usage limit value input
- `[data-cy="edit-key-button"]` - Edit button
- `[data-cy="delete-key-button"]` - Delete button
- `[data-cy="copy-key-button"]` - Copy button
- `[data-cy="view-key-button"]` - View button
- `[data-cy="confirm-delete-button"]` - Confirm delete button
- `[data-cy="cancel-delete-button"]` - Cancel delete button
- `[data-cy="save-key-button"]` - Save/submit button
- `[data-cy="new-api-key"]` - New API key input field 