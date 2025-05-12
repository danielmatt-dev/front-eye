export const resultados = [
    'Todos', 'Proliferativo', 'Moderado', 'Leve', 'Sin Afección'
]

export const afecciones = [
    'Todas',
    'DMAE Humeda',
    'DMAE Seca',
    'Retinopatía Diabética'
]

export const reports = [
    { id: 'c496f7', fecha: '21/05/2025', hora: '06:14 AM', edad: 33, afeccion: 'DMAE Humeda', ojo: 'Derecho', resultado: 'Proliferativo' },
    { id: '4cd866', fecha: '04/05/2025', hora: '04:38 PM', edad: 66, afeccion: 'DMAE Seca', ojo: 'Izquierdo', resultado: 'Proliferativo' },
    { id: '2f2770', fecha: '01/05/2025', hora: '12:35 AM', edad: 28, afeccion: 'Retinopatía Diabética', ojo: 'Derecho', resultado: 'Moderado' },
    { id: '44dfc1', fecha: '24/05/2025', hora: '06:45 AM', edad: 88, afeccion: 'DMAE Humeda', ojo: 'Derecho', resultado: 'Leve' },
    { id: 'aacfcb', fecha: '20/05/2025', hora: '08:44 PM', edad: 55, afeccion: 'Retinopatía Diabética', ojo: 'Derecho', resultado: 'Leve' },
    { id: 'd01787', fecha: '08/05/2025', hora: '05:26 PM', edad: 64, afeccion: 'Retinopatía Diabética', ojo: 'Izquierdo', resultado: 'Proliferativo' },
    { id: '8da49a', fecha: '08/05/2025', hora: '07:28 AM', edad: 42, afeccion: 'Retinopatía Diabética', ojo: 'Izquierdo', resultado: 'Sin Afeccion' },
    { id: '5484b0', fecha: '05/05/2025', hora: '06:17 PM', edad: 26, afeccion: 'DMAE Seca', ojo: 'Izquierdo', resultado: 'Sin Afeccion' },
    { id: '3707a9', fecha: '24/05/2025', hora: '12:48 AM', edad: 23, afeccion: 'Retinopatía Diabética', ojo: 'Derecho', resultado: 'Sin Afeccion' },
    { id: '7c2861', fecha: '20/05/2025', hora: '05:44 AM', edad: 47, afeccion: 'Retinopatía Diabética', ojo: 'Derecho', resultado: 'Leve' },
    { id: 'ec3030', fecha: '22/05/2025', hora: '01:21 PM', edad: 55, afeccion: 'DMAE Seca', ojo: 'Izquierdo', resultado: 'Leve' },
    { id: '5c9b55', fecha: '24/05/2025', hora: '08:09 AM', edad: 28, afeccion: 'Retinopatía Diabética', ojo: 'Derecho', resultado: 'Proliferativo' },
    { id: 'c7378f', fecha: '29/05/2025', hora: '06:48 AM', edad: 47, afeccion: 'Retinopatía Diabética', ojo: 'Izquierdo', resultado: 'Sin Afeccion' },
    { id: 'bf81bd', fecha: '12/05/2025', hora: '10:06 AM', edad: 30, afeccion: 'DMAE Seca', ojo: 'Izquierdo', resultado: 'Proliferativo' },
    { id: '1b32a4', fecha: '03/05/2025', hora: '02:24 AM', edad: 66, afeccion: 'DMAE Seca', ojo: 'Izquierdo', resultado: 'Proliferativo' },
    { id: '8f03f9', fecha: '19/05/2025', hora: '03:22 AM', edad: 53, afeccion: 'DMAE Humeda', ojo: 'Derecho', resultado: 'Proliferativo' },
    { id: '006644', fecha: '14/05/2025', hora: '11:38 AM', edad: 76, afeccion: 'DMAE Humeda', ojo: 'Izquierdo', resultado: 'Moderado' },
    { id: '3d99fe', fecha: '02/05/2025', hora: '08:51 AM', edad: 64, afeccion: 'DMAE Humeda', ojo: 'Derecho', resultado: 'Sin Afeccion' },
    { id: 'c14b33', fecha: '01/05/2025', hora: '01:46 AM', edad: 38, afeccion: 'Retinopatía Diabética', ojo: 'Derecho', resultado: 'Sin Afeccion' },
    { id: 'a11288', fecha: '03/05/2025', hora: '02:34 PM', edad: 65, afeccion: 'Retinopatía Diabética', ojo: 'Izquierdo', resultado: 'Moderado' }
];

export const dataPointsMocks = [
    // Centros de interés y turísticos
    { lat: 18.8498, lng: -97.1039, name: 'Centro Histórico' },
    { lat: 18.8477, lng: -97.1014, name: 'Teleférico de Orizaba' },
    { lat: 18.8512, lng: -97.1056, name: 'Parque Castillo' },
    { lat: 18.8536, lng: -97.1069, name: 'Museo de Arte del Estado' },
    { lat: 18.8452, lng: -97.1022, name: 'Palacio de Hierro' },
    { lat: 18.8501, lng: -97.1104, name: 'ADO Orizaba' },
    { lat: 18.8509, lng: -97.1007, name: 'Catedral de San Miguel Arcángel' },
    { lat: 18.8459, lng: -97.0978, name: 'Parque López' },
    { lat: 18.8520, lng: -97.1001, name: 'Museo Francisco Gabilondo Soler' },
    { lat: 18.8490, lng: -97.1025, name: 'Alameda Central' },

    // Parques y naturaleza
    { lat: 18.8513, lng: -97.0981, name: 'Ecoparque Cerro del Borrego' },
    { lat: 18.8455, lng: -97.1060, name: 'Paseo del Río Orizaba' },
    { lat: 18.8429, lng: -97.1044, name: 'Paseo de los 500 Escalones' },
    { lat: 18.8518, lng: -97.1087, name: 'Parque Apolinar Castillo' },
    { lat: 18.8531, lng: -97.1075, name: 'Parque Bicentenario' },

    // Instituciones educativas
    { lat: 18.8484, lng: -97.1070, name: 'Universidad Veracruzana - Facultad de Ciencias Químicas' },
    { lat: 18.8468, lng: -97.1108, name: 'Instituto Tecnológico de Orizaba' },
    { lat: 18.8547, lng: -97.1089, name: 'Escuela Secundaria Técnica No. 4' },
    { lat: 18.8553, lng: -97.0997, name: 'Centro Educativo de Orizaba' },
    { lat: 18.8505, lng: -97.0983, name: 'Colegio Preparatorio de Orizaba' },

    // Instalaciones deportivas
    { lat: 18.8500, lng: -97.1080, name: 'Gimnasio CDO Sur' },
    { lat: 18.8483, lng: -97.1032, name: 'Estadio Socum' },
    { lat: 18.8510, lng: -97.1008, name: 'Deportivo Orizaba' },
    { lat: 18.8535, lng: -97.1064, name: 'Parque de las Sonrisas' },

    // Comercios y centros comerciales
    { lat: 18.8497, lng: -97.1051, name: 'Plaza Valle Orizaba' },
    { lat: 18.8465, lng: -97.1030, name: 'Plaza Orizaba' },
    { lat: 18.8491, lng: -97.1015, name: 'Mercado Melchor Ocampo' },
    { lat: 18.8480, lng: -97.1048, name: 'Tianguis Orizaba' },
    { lat: 18.8514, lng: -97.1029, name: 'Chedraui Orizaba' },

    // Hospitales y servicios médicos
    { lat: 18.8493, lng: -97.1076, name: 'Hospital Regional de Río Blanco' },
    { lat: 18.8488, lng: -97.1099, name: 'Clínica del IMSS' },
    { lat: 18.8470, lng: -97.1041, name: 'Hospital Covadonga' },
    { lat: 18.8502, lng: -97.0990, name: 'Cruz Roja Orizaba' },

    // Otros lugares emblemáticos
    { lat: 18.8504, lng: -97.1035, name: 'Ex-Convento de San José de Gracia' },
    { lat: 18.8481, lng: -97.1072, name: 'Antiguo Teatro Llave' },
    { lat: 18.8473, lng: -97.1023, name: 'Museo Interactivo de Orizaba' },
    { lat: 18.8461, lng: -97.1057, name: 'Archivo Histórico de Orizaba' }
]

export const doctores = [
    {
        clave: 'D001',
        nombre: 'Carlos',
        apellidoPaterno: 'Gómez',
        apellidoMaterno: 'Hernández',
        fechaNacimiento: '12/05/1980',
        fechaAlta: '01/01/2025',
        telefono: '1234567890',
        genero: 'Masculino',
        codigoPostal: '94300',
        direccion: 'Calle Reforma #123, Centro, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D002',
        nombre: 'María',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Ramírez',
        fechaNacimiento: '08/11/1975',
        fechaAlta: '01/02/2025',
        telefono: '0987654321',
        genero: 'Femenino',
        codigoPostal: '94320',
        direccion: 'Av. Circunvalación #456, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D003',
        nombre: 'Luis',
        apellidoPaterno: 'Martínez',
        apellidoMaterno: 'López',
        fechaNacimiento: '21/03/1990',
        fechaAlta: '01/03/2025',
        telefono: '2143658709',
        genero: 'Masculino',
        codigoPostal: '94340',
        direccion: 'Blvd. Colón #789, Norte, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D004',
        nombre: 'Sofía',
        apellidoPaterno: 'García',
        apellidoMaterno: 'Cruz',
        fechaNacimiento: '30/07/1985',
        telefono: '1223344556',
        fechaAlta: '01/04/2025',
        genero: 'Femenino',
        codigoPostal: '94360',
        direccion: 'Calle Sur 4 #321, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D005',
        nombre: 'Jorge',
        apellidoPaterno: 'Ramírez',
        apellidoMaterno: 'Torres',
        fechaNacimiento: '15/01/1978',
        fechaAlta: '01/05/2025',
        telefono: '5667788990',
        genero: 'Masculino',
        codigoPostal: '94380',
        direccion: 'Calle Poniente 12 #654, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D006',
        nombre: 'Ana',
        apellidoPaterno: 'López',
        apellidoMaterno: 'Rivera',
        fechaNacimiento: '05/02/1995',
        telefono: '0998877665',
        fechaAlta: '01/06/2025',
        genero: 'Femenino',
        codigoPostal: '94400',
        direccion: 'Calle Oriente 2 #987, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D007',
        nombre: 'Roberto',
        apellidoPaterno: 'Vázquez',
        apellidoMaterno: 'Martínez',
        fechaNacimiento: '10/06/1988',
        fechaAlta: '01/07/2025',
        telefono: '0192838475',
        genero: 'Masculino',
        codigoPostal: '94410',
        direccion: 'Calle Norte 8 #456, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D008',
        nombre: 'Gabriela',
        apellidoPaterno: 'Hernández',
        apellidoMaterno: 'Morales',
        fechaNacimiento: '22/08/1983',
        fechaAlta: '01/08/2025',
        telefono: '0561804719',
        genero: 'Femenino',
        codigoPostal: '94420',
        direccion: 'Calle Oriente 4 #321, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D009',
        nombre: 'Fernando',
        apellidoPaterno: 'Ortega',
        apellidoMaterno: 'Sánchez',
        fechaNacimiento: '17/04/1991',
        fechaAlta: '01/09/2025',
        telefono: '9291040194',
        genero: 'Masculino',
        codigoPostal: '94430',
        direccion: 'Calle Poniente 6 #789, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D010',
        nombre: 'Laura',
        apellidoPaterno: 'Mendoza',
        apellidoMaterno: 'Salas',
        fechaNacimiento: '29/12/1982',
        fechaAlta: '01/10/2025',
        telefono: '129091244',
        genero: 'Femenino',
        codigoPostal: '94440',
        direccion: 'Calle Sur 10 #432, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D011',
        nombre: 'Alberto',
        apellidoPaterno: 'Rivas',
        apellidoMaterno: 'Gómez',
        fechaNacimiento: '07/09/1979',
        fechaAlta: '01/11/2025',
        telefono: '312312980',
        genero: 'Masculino',
        codigoPostal: '94450',
        direccion: 'Calle Reforma #101, Centro, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'D012',
        nombre: 'Daniela',
        apellidoPaterno: 'Núñez',
        apellidoMaterno: 'Díaz',
        fechaNacimiento: '02/03/1993',
        fechaAlta: '01/12/2025',
        telefono: '0192941801',
        genero: 'Femenino',
        codigoPostal: '94460',
        direccion: 'Calle Colón #333, Norte, Orizaba',
        estado: 'Veracruz'
    }
];

export const generos = [
    'Masculino',
    'Femenino',
]

export const patients = [
    {
        clave: 'P001',
        nombre: 'Ana',
        apellidoPaterno: 'Gómez',
        apellidoMaterno: 'Martínez',
        fechaNacimiento: '12/03/1990',
        edad: 34,
        genero: 'Femenino',
        ocupacion: 'Enfermera',
        correo: 'ana.gomez@hospital.com',
        telefono: '2291234567',
        codigoPostal: '94300',
        direccion: 'Calle Sur 8 #234, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'P002',
        nombre: 'Luis',
        apellidoPaterno: 'Hernández',
        apellidoMaterno: 'Pérez',
        fechaNacimiento: '05/11/1985',
        edad: 38,
        genero: 'Masculino',
        ocupacion: 'Ingeniero',
        correo: 'luis.hernandez@company.com',
        telefono: '2297654321',
        codigoPostal: '94320',
        direccion: 'Av. Oriente 5 #120, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'P003',
        nombre: 'María',
        apellidoPaterno: 'López',
        apellidoMaterno: 'Ruiz',
        fechaNacimiento: '19/07/2000',
        edad: 23,
        genero: 'Femenino',
        ocupacion: 'Estudiante',
        correo: 'maria.lopez@universidad.com',
        telefono: '2293344556',
        codigoPostal: '94340',
        direccion: 'Privada Norte 3 #56, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'P004',
        nombre: 'Carlos',
        apellidoPaterno: 'Ramírez',
        apellidoMaterno: 'Torres',
        fechaNacimiento: '25/01/1972',
        edad: 52,
        genero: 'Masculino',
        ocupacion: 'Abogado',
        correo: 'carlos.ramirez@bufete.com',
        telefono: '2299988776',
        codigoPostal: '94360',
        direccion: 'Calle Reforma #78, Orizaba',
        estado: 'Veracruz'
    },
    {
        clave: 'P005',
        nombre: 'Lucía',
        apellidoPaterno: 'Fernández',
        apellidoMaterno: 'Castro',
        fechaNacimiento: '30/09/1995',
        edad: 28,
        genero: 'Femenino',
        ocupacion: 'Doctora',
        correo: 'lucia.fernandez@hospital.com',
        telefono: '2291122334',
        codigoPostal: '94380',
        direccion: 'Av. Colón #900, Orizaba',
        estado: 'Veracruz'
    }
];

export const inspecciones = [
    {
        id: 'I001',
        fecha: '2023-08-15',
        hora: '10:30',
        edad: 34,
        afeccion: 'DMAE Seca',
        ojo: 'Izquierdo',
        resultado: 'Sin Afección'
    },
    {
        id: 'I002',
        fecha: '2023-08-15',
        hora: '11:45',
        edad: 58,
        afeccion: 'Retinopatía Diabética',
        ojo: 'Derecho',
        resultado: 'Leve'
    },
    {
        id: 'I003',
        fecha: '2023-08-16',
        hora: '09:20',
        edad: 42,
        afeccion: 'DMAE Húmeda',
        ojo: 'Izquierdo',
        resultado: 'Moderado'
    },
    {
        id: 'I004',
        fecha: '2023-08-16',
        hora: '12:00',
        edad: 29,
        afeccion: 'Retinopatía Diabética',
        ojo: 'Derecho',
        resultado: 'Proliferativo'
    },
    {
        id: 'I005',
        fecha: '2023-08-17',
        hora: '08:15',
        edad: 67,
        afeccion: 'DMAE Seca',
        ojo: 'Derecho',
        resultado: 'Proliferativo'
    }
];
