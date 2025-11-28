// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (email = 'admin@urbana.com', password = 'admin123') => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard', { timeout: 10000 })
})

// Declare custom commands for TypeScript
declare global {
    namespace Cypress {
        interface Chainable {
            login(email?: string, password?: string): Chainable<void>
        }
    }
}

export { }
