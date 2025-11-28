describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/login')
    })

    it('should display login form', () => {
        cy.get('input[type="email"]').should('be.visible')
        cy.get('input[type="password"]').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
        cy.get('button[type="submit"]').click()
        // Browser validation will prevent submission
        cy.url().should('include', '/login')
    })

    it('should login successfully with valid credentials', () => {
        cy.get('input[type="email"]').type('admin@urbana.com')
        cy.get('input[type="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        // Should redirect to dashboard
        cy.url().should('include', '/dashboard', { timeout: 10000 })
    })

    it('should show error with invalid credentials', () => {
        cy.get('input[type="email"]').type('wrong@example.com')
        cy.get('input[type="password"]').type('wrongpassword')
        cy.get('button[type="submit"]').click()

        // Should show error message
        cy.contains('inválidas', { matchCase: false }).should('be.visible')
    })
})
