import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { PatientWithInspectionsModel } from '../../../../../patient/data/models/patient.with.inspections.model';

export class GeographicDataReportPdf extends AbstractReportPdf {

    patients: PatientWithInspectionsModel[] = [];
    headers: Record<string, string> = {}
    data: Record<string, string> = {}
    username: string = ''

    constructor(partial?: Partial<GeographicDataReportPdf>) {
        super();
        Object.assign(this, partial);
    }

    protected override getTitle(): string {
        return this.headers['title']
    }

    protected override getUsername(): string {
        return this.username
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            [
                this.headers['id'],
                this.headers['patient'],
                this.headers['latitude'],
                this.headers['longitude'],
                this.headers['disease'],
                this.headers['result'],
                this.headers['numInspections']
            ]
        ];
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
