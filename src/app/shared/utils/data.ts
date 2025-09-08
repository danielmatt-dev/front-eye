// Revisar antes de enviar
// gender, eye, periodos

import { Lang } from './functions/translate-lang';

export interface OptionLabel {
    label: string,
    value: any,
    short?: string
}

export const genders: Record<Lang, OptionLabel[]> = {
    en: [
        { label: 'Male', value: 'Masculino' },
        { label: 'Female', value: 'Femenino' }
    ],
    es: [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' }
    ]
}

export const eyes: Record<Lang, OptionLabel[]> = {
    en: [
        { label: 'Right', value: 'Derecho' },
        { label: 'Left', value: 'Izquierdo' }
    ],
    es: [
        { label: 'Derecho', value: 'Derecho' },
        { label: 'Izquierdo', value: 'Izquierdo' }
    ]
}

export const diseases: Record<Lang, OptionLabel[]> = {
    en: [
        { label: 'Wet AMD', value: 1 },
        { label: 'Dry AMD', value: 2 },
        { label: 'Diabetic Retinopathy', value: 3 },
        { label: 'All', value: -1 },
    ],
    es: [
        { label: 'DMAE Húmeda', value: 1 },
        { label: 'DMAE Seca', value: 2 },
        { label: 'Retinopatía Diabética', value: 3 },
        { label: 'Todas', value: -1 },
    ]
}

export const ageRanges: Record<Lang, OptionLabel[]> = {
    en: [
        { label: 'Under 30', value: 1 },
        { label: '30 to 45', value: 2 },
        { label: 'Over 45', value: 3 },
    ],
    es: [
        { label: 'Menos de 30', value: 1 },
        { label: 'De 30 a 45', value: 2 },
        { label: 'Más de 45', value: 3 },
    ]
}

export const results: Record<Lang, OptionLabel[]> = {
    en: [
        { label: 'No condition', value: 'Sin afección' },
        { label: 'Mild', value: 'Leve' },
        { label: 'Moderate', value: 'Moderado' },
        { label: 'Proliferative', value: 'Proliferativo' },
        { label: 'Advanced', value: 'Avanzada' },
        { label: 'Advanced Wet', value: 'Avanzada Húmeda' },
        { label: 'All', value: -1 }
    ],
    es: [
        { label: 'Sin Afección', value: 'Sin afección' },
        { label: 'Leve', value: 'Leve' },
        { label: 'Moderado', value: 'Moderado' },
        { label: 'Proliferativo', value: 'Proliferativo' },
        { label: 'Avanzada', value: 'Avanzada' },
        { label: 'Avanzada Húmeda', value: 'Avanzada Húmeda' },
        { label: 'Todos', value: -1 }
    ]
}

export const periods: Record<Lang, OptionLabel[]> = {
    es: [
        { label: 'Mes actual', value: 0 },
        { label: '2 meses', value: 1 },
        { label: '3 meses', value: 2 },
        { label: 'Personalizado', value: -1 }
    ],
    en: [
        { label: 'Current month', value: 0 },
        { label: '2 months', value: 1 },
        { label: '3 months', value: 2 },
        { label: 'Custom', value: -1 }
    ]
}

export const options: Record<Lang, OptionLabel[]> = {
    en: [
        { label: '1 Day', value: 1 },
        { label: '1 Week', value: 2 },
        { label: '1 Month', value: 3 },
        { label: '3 Months', value: 4 },
        { label: 'All', value: -1 },
        { label: 'Range', value: 0 }
    ],
    es: [
        { label: '1 Día', value: 1 },
        { label: '1 Semana', value: 2 },
        { label: '1 Mes', value: 3 },
        { label: '3 Meses', value: 4 },
        { label: 'Todo', value: -1 },
        { label: 'Rango', value: 0 }
    ]
}

export const geographicLabels = {
    en: {
        filter: 'Filters',
        ageRange: 'Age ranges',
        gender: 'Gender',
        result: 'Result',
        disease: 'Disease',
        numInspections: 'Num. Inspections'
    },
    es: {
        filter: 'Filtros',
        ageRange: 'Rangos de edad',
        gender: 'Género',
        result: 'Resultado',
        disease: 'Afección',
        numInspections: 'Num. Inspecciones'
    }
}

export const toolTips = {
    en: {
        name: 'Name',
        age: 'Age',
        years: 'years',
        gender: 'Gender',
        occupation: 'Occupation',
        address: 'Address',
        postalCode: 'Postal Code'
    },
    es: {
        name: 'Nombre',
        age: 'Edad',
        years: 'años',
        gender: 'Género',
        occupation: 'Ocupación',
        address: 'Dirección',
        postalCode: 'Código Postal'
    }
}

export const doctorHeaders: Record<Lang, Record<string, string>> = {
    en: {
        title: 'Doctors',
        id: 'ID',
        name: 'Name',
        clinic: 'Clinic',
        birthdate: 'Birthdate',
        email: 'Email',
        gender: 'Gender',
        address: 'Address',
        filename: 'patients_report'
    },
    es: {
        title: 'Doctores',
        id: 'ID',
        name: 'Nombre',
        clinic: 'Clínica',
        birthdate: 'Fecha de nacimiento',
        email: 'Correo',
        gender: 'Género',
        address: 'Dirección',
        filename: 'reporte_doctores'
    }
}

export const geographicHeaders: Record<Lang, Record<string, string>> = {
    en: {
        title: 'Geographic Data',
        id: 'ID',
        patient: 'Patient',
        latitude: 'Latitude',
        longitude: 'Longitude',
        disease: 'Disease',
        result: 'Result',
        numInspections: 'Num. Inspections',
        filename: 'geographic_data_report'
    },
    es: {
        title: 'Datos geográficos',
        id: 'ID',
        patient: 'Paciente',
        latitude: 'Latitud',
        longitude: 'Longitud',
        disease: 'Afección',
        result: 'Resultado',
        numInspections: 'Num. Inspecciones',
        filename: 'reporte_datos_geograficos'
    }
}

export const inspectionHeaders: Record<Lang, Record<string, string>> = {
    en: {
        title: 'Inspections',
        id: 'ID',
        date: 'Date',
        time: 'Time',
        age: 'Age',
        years: 'years',
        disease: 'Disease',
        eye: 'Eye',
        result: 'Result',
        filename: 'inspections_report'
    },
    es: {
        title: 'Inspecciones',
        id: 'ID',
        date: 'Fecha',
        time: 'Hora',
        age: 'Edad',
        years: 'años',
        disease: 'Afección',
        eye: 'Ojo',
        result: 'Resultado',
        filename: 'reporte_inspecciones'
    }
}

export const patientHeaders: Record<Lang, Record<string, string>> = {
    en: {
        title: 'Patients',
        id: 'ID',
        patient: 'Patient',
        birthdate: 'Birthdate',
        gender: 'Gender',
        email: 'Email',
        occupation: 'Occupation',
        address: 'Address',
        filename: 'patients_report'
    },
    es: {
        title: 'Pacientes',
        id: 'ID',
        patient: 'Paciente',
        birthdate: 'Fecha de nacimiento',
        gender: 'Género',
        email: 'Correo',
        occupation: 'Ocupación',
        address: 'Dirección',
        filename: 'reporte_pacientes'
    }
}

export const detailsHeaders: Record<Lang, Record<string, string>> = {
    en: {
        details: 'Inspection Details',
        data: 'Inspection Data',
        occurrence: 'Occurrence Probability (AI)',
        results: 'Results',
        probability: 'Probability (%)',
        images: 'Images',
        patient: 'Patient Data',
        notes: 'Additional Notes'
    },
    es: {
        details: 'Detalle de la inspección',
        data: 'Datos de la inspección',
        occurrence: 'Probabilidad de Ocurrencia (IA)',
        results: 'Resultados',
        probability: 'Probabilidad (%)',
        images: 'Imágenes',
        patient: 'Datos del paciente',
        notes: 'Notas adicionales'
    }
}

export const pdf = {
    en: {
        page: 'Page',
        pc: 'pc',
        years: 'years'
    },
    es: {
        page: 'Página',
        pc: 'cp',
        years: 'años'
    }
}

export const months: Record<Lang, OptionLabel[]> = {
    es: [
        { label: 'Enero', short: 'Ene', value: 1 },
        { label: 'Febrero', short: 'Feb', value: 2 },
        { label: 'Marzo', short: 'Mar', value: 3 },
        { label: 'Abril', short: 'Abr', value: 4 },
        { label: 'Mayo', short: 'May', value: 5 },
        { label: 'Junio', short: 'Jun', value: 6 },
        { label: 'Julio', short: 'Jul', value: 7 },
        { label: 'Agosto', short: 'Ago', value: 8 },
        { label: 'Septiembre', short: 'Sep', value: 9 },
        { label: 'Octubre', short: 'Oct', value: 10 },
        { label: 'Noviembre', short: 'Nov', value: 11 },
        { label: 'Diciembre', short: 'Dic', value: 12 }
    ],
    en: [
        { label: 'January', short: 'Jan', value: 1 },
        { label: 'February', short: 'Feb', value: 2 },
        { label: 'March', short: 'Mar', value: 3 },
        { label: 'April', short: 'Apr', value: 4 },
        { label: 'May', short: 'May', value: 5 },
        { label: 'June', short: 'Jun', value: 6 },
        { label: 'July', short: 'Jul', value: 7 },
        { label: 'August', short: 'Aug', value: 8 },
        { label: 'September', short: 'Sep', value: 9 },
        { label: 'October', short: 'Oct', value: 10 },
        { label: 'November', short: 'Nov', value: 11 },
        { label: 'December', short: 'Dec', value: 12 }
    ]
}

export const days: Record<Lang, OptionLabel[]> = {
    es: [
        { label: 'Domingo', short: 'Dom', value: 0 },
        { label: 'Lunes', short: 'Lun', value: 1 },
        { label: 'Martes', short: 'Mar', value: 2 },
        { label: 'Miércoles', short: 'Mié', value: 3 },
        { label: 'Jueves', short: 'Jue', value: 4 },
        { label: 'Viernes', short: 'Vie', value: 5 },
        { label: 'Sábado', short: 'Sáb', value: 6 }
    ],
    en: [
        { label: 'Sunday', short: 'Sun', value: 0 },
        { label: 'Monday', short: 'Mon', value: 1 },
        { label: 'Tuesday', short: 'Tue', value: 2 },
        { label: 'Wednesday', short: 'Wed', value: 3 },
        { label: 'Thursday', short: 'Thu', value: 4 },
        { label: 'Friday', short: 'Fri', value: 5 },
        { label: 'Saturday', short: 'Sat', value: 6 }
    ]
}

export const DICTS: Record<string, Record<Lang, OptionLabel[]>> = {
    ['gender']: genders,
    ['eye']: eyes,
    ['disease']: diseases,
    ['ageRange']: ageRanges,
    ['period']: periods,
    ['result']: results,
    ['month']: months,
    ['day']: days,
    ['option']: options
}

export const HEADERS: Record<string, Record<Lang, Record<string, string>>> = {
    ['doctor']: doctorHeaders,
    ['patient']: patientHeaders,
    ['inspection']: inspectionHeaders,
    ['geographic']: geographicHeaders,
    ['details']: detailsHeaders,
    ['pdf']: pdf
}

export const LIST_OPTIONS = [
    ...genders['es'],
    ...eyes['es'],
    ...diseases['es'],
    ...ageRanges['es'],
    ...periods['es'],
    ...results['es'],
    ...months['es'],
    ...genders['en'],
    ...eyes['en'],
    ...diseases['en'],
    ...ageRanges['en'],
    ...periods['en'],
    ...results['en'],
    ...months['en']
]

export const statesMexico: string[] = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
];

export enum State {
    initial,
    loading,
    success
}

export const menu = {
    en: {
        dashboard: 'Dashboard',
        inspections: 'Inspections',
        geo: 'Geographic Data',
        doctors: 'Manage Doctors',
        adminInspections: 'Manage Inspections',
        newInspection: 'New Inspection',
        allInspections: 'All Inspections',
        patients: 'Manage Patients',
        logout: 'Log out'
    },
    es: {
        dashboard: 'Dashboard',
        inspections: 'Inspecciones',
        geo: 'Datos Geográficos',
        doctors: 'Administrar doctores',
        adminInspections: 'Administrar inspecciones',
        newInspection: 'Nueva inspección',
        allInspections: 'Todas las inspecciones',
        patients: 'Administrar pacientes',
        logout: 'Cerrar sesión'
    }
};
