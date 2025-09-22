/**
 * Mapa de colores principales usados en la aplicación.
 *
 * @description
 * Define una paleta de colores básicos en formato hexadecimal que sirven
 * como referencia para otras constantes de color.
 */
export const mapColors = {
    /** Color rojo de referencia. @example "#ff3d32" */
    'red': '#ff3d32',
    'redLight': '#FF7043',
    'orange': '#F4A460',
    'yellow': '#FFC107',
    'blue': '#3b82f6',
    /** Color verde de referencia. @example "#22c55e" */
    'green': '#22c55e'
}

/**
 * Colores asociados al género de una persona.
 *
 * @description
 * Define un color representativo para valores de género como "male" y "female".
 */
export const genderColor = {
    /** Color representativo del género masculino. @example "#2196f3" */
    'male': '#2196f3',

    /** Color representativo del género femenino. @example "#E91E63" */
    'female': '#E91E63'
}

/**
 * Colores asociados a los resultados de diagnósticos médicos.
 *
 * @description
 * Relaciona los distintos resultados clínicos con colores de la paleta `mapColors`.
 */
export const resultColor = {
    /** Color para casos sin condición detectada. Usa `mapColors.green`. */  
    'nocondition': mapColors.green,
    
    /** Color para casos leves. Usa `mapColors.blue`. */
    'mild': mapColors.blue,
  
    /** Color para casos moderados. Usa `mapColors.amber`. */
    'moderate': mapColors.yellow,
    'advanced': mapColors.orange,
    'advancedwet': mapColors.redLight,
  
     /** Color para casos proliferativos. Usa `mapColors.red`. */
    'proliferative': mapColors.red,

}

/**
 * Colores específicos asociados a diferentes enfermedades oculares.
 *
 * @description
 * Define colores para condiciones oftalmológicas como degeneración macular
 * seca, húmeda, retinopatía diabética, entre otras.
 */
export const diseaseColor = {
    /** Color para Degeneración Macular Seca (Dry AMD). @example "#fbc02d" */
    'dryAmd': '#fbc02d',

    /** Color para Degeneración Macular Húmeda (Wet AMD). @example "#009688" */
    'wetAmd': '#009688',

    /** Color para Retinopatía Diabética. @example "#9c27b0" */
    'diabeticRetinopathy': '#9c27b0',

    /** Color genérico para otras condiciones. @example "#" */
    'other': '#'
}
