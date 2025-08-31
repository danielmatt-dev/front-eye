import { AbstractReportExcel } from '../abstract.report.excel';
import { Worksheet } from 'exceljs';
import { PatientResponseModel } from '../../../../../patient/data/models/patient.response.model';

export class PatientReportExcel extends AbstractReportExcel {

    patients: PatientResponseModel[] = [];

    constructor(partial?: Partial<PatientReportExcel>) {
        super();
        Object.assign(this, partial);
    }

    protected override getFileName(): string {
        return 'reporte_pacientes'
    }

    protected override getWorksheetName(): string {
        return 'Pacientes'
    }

    protected override addHeaders(): { key: string; header: string }[] {
        return [
            { key: 'patientId', header: 'ID' },
            { key: 'fullName', header: 'Paciente' },
            { key: 'birthDate', header: 'Fecha de nacimiento' },
            { key: 'gender', header: 'Género' },
            { key: 'email', header: 'Correo' },
            { key: 'occupation', header: 'Ocupación' },
            { key: 'address', header: 'Dirección' },
        ]
    }

    protected override addBody(sheet: Worksheet): Worksheet {
        this.patients.map(patient => {
            sheet.addRow({
                patientId: patient.patientId,
                fullName: `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`,
                birthDate: patient.birthDate.toLocaleDateString('en-GB'),
                gender: patient.gender,
                email: patient.email,
                occupation: patient.occupation,
                address: `${patient.address}. cp ${patient.postalCode}. ${patient.state}`
            })
        })
        return sheet
    }

}
