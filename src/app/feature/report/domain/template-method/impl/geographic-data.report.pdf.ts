import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { PatientWithInspectionsEntity } from '../../../../patient/domain/entity/patient.with.inspections.entity';

export class GeographicDataReportPdf extends AbstractReportPdf {

    patients: PatientWithInspectionsEntity[] = []

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
