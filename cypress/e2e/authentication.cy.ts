describe('Authentication', () => {
  it('Admin user should be able to securely log in', () => {
    cy.visit('/login')
    cy.intercept('POST', '/api/login').as('auth')
    cy.intercept('GET', '/api/users').as('getUsers')

    cy.get('input[id="Email"]').type('admin@dapa.com')
    cy.get('input[id="Password"]').type('dapa12345')
    cy.get('button').contains('Iniciar sesión').click()
    cy.wait('@auth')

    cy.get('h1').contains('Usuarios').should('be.visible')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist
    })

    cy.wait('@getUsers')
  })
})
