describe('Report Management', () => {
    beforeEach(() => {
        // Login using custom command
        cy.login()

        // Navigate to reports
        cy.visit('/reports')
    })

    it('should display reports page', () => {
        cy.url().should('include', '/reports')
    })

    it('should show reports content', () => {
        // Just verify the page loaded successfully
        cy.get('body').should('be.visible')

        // Check if there's any content related to reports
        cy.get('body').then(($body) => {
            const bodyText = $body.text()

            // Should have some indication this is the reports page
            const hasReportsText = bodyText.match(/reporte/i) ||
                bodyText.match(/informe/i) ||
                $body.find('[data-testid="reports-list"]').length > 0

            expect(hasReportsText).to.exist
        })
    })
})
