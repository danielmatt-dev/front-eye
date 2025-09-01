import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { PatientWithInspectionsModel } from '../../../../../patient/data/models/patient.with.inspections.model';

export class GeographicDataReportPdf extends AbstractReportPdf {

    patients: PatientWithInspectionsModel[] = []

    constructor(partial?: Partial<GeographicDataReportPdf>) {
        super()
        Object.assign(this, partial)
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            ['ID', 'Paciente', 'Latitud', 'Longitud', 'Afección', 'Resultado', 'Num. Inspecciones']
        ]
    }

    protected override getBody(): RowInput[] {
        return this.patients.map(patient => [
            patient.patientId.toString(),
            patient.fullName,
            patient.latitude.toString(),
            patient.longitude.toString(),
            patient.lastDisease,
            patient.lastResult,
            patient.inspectionCount
        ])
    }

}
