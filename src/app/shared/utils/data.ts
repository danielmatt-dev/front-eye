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

export const eyes = [
    'Derecho',
    'Izquierdo'
]

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

export const results = [
    'Proliferativo',
    'Moderado',
    'Leve',
    'Sin Afección'
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
