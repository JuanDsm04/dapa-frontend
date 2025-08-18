describe('Formulario de Vehículos', () => {
  it('Debe iniciar sesión y registrar un vehículo con datos válidos', () => {
    // Paso 1: Login
    cy.visit('/login');
    cy.get('input[id="Email"]').type('admin@dapa.com');
    cy.get('input[id="Password"]').type('dapa12345');
    cy.get('button[type="submit"]').click();

    // Paso 2: Ir a la página de vehículos
    cy.visit('/vehicles');

    // Paso 3: Registrar vehículo
    cy.get('[data-testid="Brand"]').type('Toyota');
    cy.get('[data-testid="Model"]').type('Corolla');
    cy.get('[data-testid="LicensePlate"]').type('P123ABC');
    cy.get('[data-testid="CurrentMileage"]').type('250000');
    cy.get('[data-testid="submit"]').click();

    // Paso 4: Verificar mensaje de éxito
    cy.contains('Vehículo registrado exitosamente').should('be.visible');
  });
});

