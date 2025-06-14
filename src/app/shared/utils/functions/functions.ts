/**
 * Calcula la edad en años completos a partir de una fecha de nacimiento.
 *
 * @param birthDate Fecha de nacimiento
 * @returns Edad en años (entero)
 */
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Si aún no ha cumplido años este año, resto 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
