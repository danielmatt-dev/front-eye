import { AbstractReportPdf } from '../abstract.report.pdf';
import { RowInput } from 'jspdf-autotable';
import { PatientResponseModel } from '../../../../../patient/data/models/patient.response.model';

export class PatientReportPdf extends AbstractReportPdf {

    patients: PatientResponseModel[] = [];
    headers: Record<string, string> = {}
    data: Record<string, string> = {}
    username: string = ''

    constructor(partial?: Partial<PatientReportPdf>) {
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
                this.headers['birthdate'],
                this.headers['gender'],
                this.headers['email'],
                this.headers['occupation'],
                this.headers['address']
            ]
        ];
    }

    protected override getBody(): RowInput[] {
        return this.patients.map((patient) => [
            patient.patientId.toString(),
            `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`,
            patient.birthDate.toLocaleDateString(),
            patient.genderOption?.label ?? '',
            patient.email,
            patient.occupation,
            `${patient.address}. ${this.headers['pc']} ${patient.postalCode}. ${patient.state}`
        ]);
    }
}
