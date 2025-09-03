/** Representa un slide en un carrusel de imágenes */
export interface Slide {
  src: string
  alt: string
}

/* Representa los errores de validación de los campos del formulario */
export interface FieldErrors {
  email?: string
}

// Tipo para cada sección del menú navbar
type Section = {
  id: string
  icon: string
  description: string
  auth: string[]
}