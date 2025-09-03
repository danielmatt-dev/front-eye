import { AbstractReportExcel } from '../abstract.report.excel';
import { Worksheet } from 'exceljs';
import { PatientResponseModel } from '../../../../../patient/data/models/patient.response.model';

export class PatientReportExcel extends AbstractReportExcel {

    patients: PatientResponseModel[] = [];
    headers: Record<string, string> = {}
    data: Record<string, string> = {}

    constructor(partial?: Partial<PatientReportExcel>) {
        super();
        Object.assign(this, partial);
    }

    protected override getFileName(): string {
        return this.headers['filename']
    }

    protected override getWorksheetName(): string {
        return this.headers['title']
    }

    protected override addHeaders(): { key: string; header: string }[] {
        return [
            { key: 'patientId', header: this.headers['id'] },
            { key: 'fullName', header: this.headers['patient'] },
            { key: 'birthDate', header: this.headers['birthdate'] },
            { key: 'gender', header: this.headers['gender'] },
            { key: 'email', header: this.headers['email'] },
            { key: 'occupation', header: this.headers['occupation'] },
            { key: 'address', header: this.headers['address'] },
        ]
    }

    protected override addBody(sheet: Worksheet): Worksheet {
        this.patients.forEach(patient => {
            sheet.addRow({
                patientId: patient.patientId,
                fullName: `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`,
                birthDate: patient.birthDate.toLocaleDateString('en-GB'),
                gender: patient.genderOption?.label,
                email: patient.email,
                occupation: patient.occupation,
                address: `${patient.address}. ${this.data['pc']} ${patient.postalCode}. ${patient.state}`
            })
        })
        return sheet
    }

}
