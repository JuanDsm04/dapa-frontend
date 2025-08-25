describe('Users', () => {
  beforeEach(() => {
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

  it('Should create a driver considering its validations', () => {
    cy.intercept('POST', '**/api/users').as('createUser');
    cy.intercept('GET', '**/api/users').as('getUsers');

    cy.contains('button', '+ Agregar').click();

    cy.get('input[name="Nombre"]').type('Test');
    cy.get('input[name="LastName"]').type('Driver');
    cy.get('input[name="Phone"]').type('1234567890');
    cy.get('input[name="Email"]').type('testdriver@dapa.com');
    cy.get('input[name="Password"]').type('dapa12345');
    cy.get('select[name="Role"]').select('Piloto');

    cy.get('input[id="LicenseExpiration"]').should('be.visible').type('2026-12-31');

    cy.contains('button', 'Confirmar').click();

    cy.wait('@createUser');
    cy.wait('@getUsers');

    cy.contains('Usuario agregado exitosamente').should('be.visible');
  })
})
