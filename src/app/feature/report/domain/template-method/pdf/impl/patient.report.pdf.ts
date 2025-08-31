import { AbstractReportPdf } from '../abstract.report.pdf';
import { RowInput } from 'jspdf-autotable';
import { formatDateToDDMMYYYY } from '../../../../../../shared/utils/functions/functions';
import { PatientResponseModel } from '../../../../../patient/data/models/patient.response.model';

export class PatientReportPdf extends AbstractReportPdf {

    patients: PatientResponseModel[] = [];

    constructor(partial?: Partial<PatientReportPdf>) {
        super();
        Object.assign(this, partial);
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            ['ID', 'Paciente', 'Fecha de nacimiento', 'Género', 'Correo', 'Ocupación', 'Dirección']
        ]
    }

    protected override getBody(): RowInput[] {
        return this.patients.map(patient => [
            patient.patientId.toString(),
            `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`,
            formatDateToDDMMYYYY(patient.birthDate),
            patient.gender,
            patient.email,
            patient.occupation,
            `${patient.address}. cp ${patient.postalCode}. ${patient.state}`
        ])
    }

}
