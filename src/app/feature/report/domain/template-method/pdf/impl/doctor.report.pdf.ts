import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { DoctorResponseModel } from '../../../../../doctor/data/models/doctor.response.model';

export class DoctorReportPdf extends AbstractReportPdf {

    doctors: DoctorResponseModel[] = [];
    headers: Record<string, string> = {}
    data: Record<string, string> = {}
    username: string = ''

    constructor(partial?: Partial<DoctorReportPdf>) {
        super();
        Object.assign(this, partial);
    }

    protected override getTitle(): string {
        return this.headers['title'];
    }

    protected override getUsername(): string {
        return this.username
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            [
                this.headers['id'],
                this.headers['name'],
                this.headers['clinic'],
                this.headers['birthdate'],
                this.headers['email'],
                this.headers['gender'],
                this.headers['address']
            ]
        ];
    }

    protected override getBody(): RowInput[] {
        return this.doctors.map((doctor) => [
            doctor.doctorId.toString(),
            `${doctor.firstName} ${doctor.lastFathName} ${doctor.lastMontName}`,
            doctor.clinic,
            doctor.birthDate.toLocaleDateString(),
            doctor.email,
            doctor.genderOption?.label ?? '',
            `${doctor.address}. ${this.headers['pc']} ${doctor.postalCode}. ${doctor.state}`
        ]);
    }
}
