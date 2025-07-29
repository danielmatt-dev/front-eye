import { diseaseColor, genderColor, resultColor } from '../../../core/theme/colors';

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

export function colorByResult(result: string) {
    switch (result) {
        case 'Avanzada': return resultColor.proliferative
        case 'Proliferativo': return resultColor.proliferative
        case 'Avanzada Húmeda': return resultColor.moderate
        case 'Moderada': return resultColor.moderate
        case 'Leve': return resultColor.mild
        default: return resultColor.nocondition
    }
}

export function colorByGender(gender: string) {
    if (gender === 'Femenino') {
        return genderColor.female
    }
    return genderColor.male
}

export function colorByDisease(disease: string) {
    switch (disease) {
        case 'DMAE Seca': return diseaseColor.dryAmd
        case 'DMAE Húmeda': return diseaseColor.wetAmd
        default: return diseaseColor.diabeticRetinopathy
    }
}

export function formatDateToSpanishMexico(date?: Date): string {
    if (!date) {
        return ''
    }

    // Opciones de formateo: día numérico, mes largo y año, en zona América/Mexico_City
    const options: Intl.DateTimeFormatOptions = {
        day:   'numeric',
        month: 'long',
        year:  'numeric',
        timeZone: 'America/Mexico_City'
    };

    // Intl.DateTimeFormat por defecto dará algo como "25 de mayo de 2024"
    return new Intl.DateTimeFormat('es-MX', options).format(date);
}

export function formatDateToDDMMYYYY(date?: Date): string {

    if (!date) {
        return ''
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // enero es 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
