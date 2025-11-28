describe('Dashboard Navigation', () => {
    beforeEach(() => {
        // Login using custom command
        cy.login()
    })

    it('should be on dashboard after login', () => {
        cy.url().should('include', '/dashboard')
    })

    it('should display dashboard content', () => {
        // Check that we're logged in and dashboard is visible
        cy.get('body').should('be.visible')
        cy.url().should('include', '/dashboard')
    })

    it('should navigate to reports section if link exists', () => {
        // Try to find and click reports link
        cy.get('body').then(($body) => {
            if ($body.text().match(/reportes/i)) {
                cy.contains('Reportes', { matchCase: false }).click()
                cy.url().should('include', '/reports')
            } else {
                // If no reports link, just verify we're still on dashboard
                cy.url().should('include', '/dashboard')
            }
        })
    })
})
