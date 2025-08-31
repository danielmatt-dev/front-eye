// Revisar antes de enviar
// gender, eye, periodos

import { Lang } from './functions/translate-lang';

export interface OptionLabel {
    label: string,
    value: any
}

export const genders = [
    'Masculino',
    'Femenino',
]

export const genders2 = {
    en: {
        male: 'Male',
        female: 'Female'
    },
    es: {
        male: 'Masculino',
        female: 'Femenino'
    }
}

export const genders3: Record<'en' | 'es', OptionLabel[]> = {
    en: [
        { label: 'Male', value: 'Masculino' },
        { label: 'Female', value: 'Femenino' }
    ],
    es: [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' }
    ]
}

export const eyes2 = {
    en: {
        right: 'Right',
        left: 'Left'
    },
    es: {
        right: 'Derecho',
        left: 'Izquierdo'
    }
}

export const eyes3: Record<'en' | 'es', OptionLabel[]> = {
    en: [
        { label: 'Right', value: 'Derecho' },
        { label: 'Left', value: 'Izquierdo' }
    ],
    es: [
        { label: 'Derecho', value: 'Derecho' },
        { label: 'Izquierdo', value: 'Izquierdo' }
    ]
}

export const diseases = [
    'DMAE Seca',
    'DMAE Húmeda',
    'Retinopatía Diabética'
]

export const diseases2 = {
    en: {
        dryAMD: 'Dry AMD',
        wetAMD: 'Wet AMD',
        diabeticRetinopathy: 'Diabetic Retinopathy'
    },
    es: {
        dryAMD: 'DMAE Seca',
        wetAMD: 'DMAE Húmeda',
        diabeticRetinopathy: 'Retinopatía Diabética'
    }
}

export const diseases3: Record<'en' | 'es', OptionLabel[]> = {
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

export const ageRanges = [
    'Menos de 30',
    'De 30 a 45',
    'Más de 45'
]

export const ageRanges2 = {
    en: {
        under30: 'Under 30',
        from30to45: '30 to 45',
        over45: 'Over 45'
    },
    es: {
        under30: 'Menos de 30',
        from30to45: 'De 30 a 45',
        over45: 'Más de 45'
    }
}

export const ageRanges3: Record<'en' | 'es', OptionLabel[]> = {
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

export const results = [
    'Proliferativo',
    'Moderado',
    'Leve',
    'Sin Afección'
]

export const results2 = {
    en: {
        proliferative: 'Proliferative',
        moderate: 'Moderate',
        mild: 'Mild',
        none: 'No condition'
    },
    es: {
        proliferative: 'Proliferativo',
        moderate: 'Moderado',
        mild: 'Leve',
        none: 'Sin Afección'
    }
}

export const results3: Record<'en' | 'es', OptionLabel[]> = {
    en: [
        { label: 'No condition', value: 'Sin Afección' },
        { label: 'Mild', value: 'Leve' },
        { label: 'Moderate', value: 'Moderado' },
        { label: 'Proliferative', value: 'Proliferativo' },
        { label: 'All', value: -1 }
    ],
    es: [
        { label: 'Sin Afección', value: 'Sin Afección' },
        { label: 'Leve', value: 'Leve' },
        { label: 'Moderado', value: 'Moderado' },
        { label: 'Proliferativo', value: 'Proliferativo' },
        { label: 'Todos', value: -1 }
    ]
}

export const periods = {
    es: {
        currentMonth: 'Mes actual',
        twoMonths: '2 meses',
        threeMonths: '3 meses',
        custom: 'Personalizado'
    },
    en: {
        currentMonth: 'Current month',
        twoMonths: '2 months',
        threeMonths: '3 months',
        custom: 'Custom'
    }
}

export const periods3: Record<'en' | 'es', OptionLabel[]> = {
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

export const labelMonths = {
    es: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    en: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ]
};

export const months: Record<'en' | 'es', OptionLabel[]> = {
    es: [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 }
    ],
    en: [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
    ]
}

export const DICTS: Record<string, Record<Lang, OptionLabel[]>> = {
    ['gender']: genders3,
    ['eye']: eyes3,
    ['disease']: diseases3,
    ['ageRange']: ageRanges3,
    ['period']: periods3,
    ['result']: results3,
    ['month']: months
}

export const LIST_OPTIONS = [
    ...genders3['es'],
    ...eyes3['es'],
    ...diseases3['es'],
    ...ageRanges3['es'],
    ...periods3['es'],
    ...results3['es'],
    ...months['es'],
    ...genders3['en'],
    ...eyes3['en'],
    ...diseases3['en'],
    ...ageRanges3['en'],
    ...periods3['en'],
    ...results3['en'],
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
