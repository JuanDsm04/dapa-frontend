describe('Forms', () => {
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

  it('User admin should be able to create custom froms', () => {
    cy.visit('/forms')

    cy.get('h1').contains('Administrador de formulario').should('be.visible')
    cy.get('button').contains('+ Agregar Pregunta').click()
    cy.get('h3').contains('Agregar Pregunta').should('be.visible')
    cy.get('input[id="question-text"]').type('Seleccione el método de pago')
    cy.get('select[id="question-type"]').select('Selección múltiple')
    cy.get('input[placeholder="Opción 1"]').type('Efectivo contra entrega')
    cy.get('button').contains('+ Agregar opción').click()
    cy.get('input[placeholder="Opción 2"]').type('Tarjeta')
    cy.get('button').contains('+ Agregar opción').click()
    cy.get('input[placeholder="Opción 3"]').type('Transferencia')
    cy.get('button').contains('Crear pregunta').click()

    cy.get('button').contains('+ Agregar Pregunta').click()
    cy.get('h3').contains('Agregar Pregunta').should('be.visible')
    cy.get('select[id="question-type"]').select('Respuesta corta')
    cy.get('input[id="question-text"]').type('Comentarios adicionales')
    cy.get('button').contains('Crear pregunta').click()

    cy.contains('Seleccione el método de pago').scrollIntoView()
      .closest('.question-card')
      .find('button')
      .contains('Editar')
      .click()

    cy.contains('+ Agregar opción').scrollIntoView()
      .click()
    cy.get('input[placeholder="Opción 4"]').type('Link VisaNet')
    cy.get('button').contains('Guardar cambios').click()

    cy.contains('Comentarios adicionales').scrollIntoView()
      .closest('.question-card')
      .find('button')
      .contains('Eliminar')
      .click()

    cy.get('div.toggle-button').contains('Preview').click()
    cy.get('h2').contains('Preview del formulario').should('be.visible')
    cy.contains('Seleccione el método de pago').scrollIntoView()
  })
})
