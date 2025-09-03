import { AbstractReportExcel } from '../abstract.report.excel';
import ExcelJS from 'exceljs';
import { DoctorResponseModel } from '../../../../../doctor/data/models/doctor.response.model';

export class DoctorReportExcel extends AbstractReportExcel {

    doctors: DoctorResponseModel[] = [];
    headers: Record<string, string> = {}
    data: Record<string, string> = {}

    constructor(partial?: Partial<DoctorReportExcel>) {
        super();
        Object.assign(this, partial);
    }

    protected override getWorksheetName(): string {
        return this.headers['title']
    }

    protected override getFileName(): string {
        return this.headers['filename']
    }

    protected override addHeaders(): { key: string, header: string }[] {
        return [
            { key: 'doctorId', header: this.headers['id'] },
            { key: 'fullname', header: this.headers['name'] },
            { key: 'clinic', header: this.headers['clinic'] },
            { key: 'birthDate', header: this.headers['birthdate'] },
            { key: 'email', header: this.headers['email'] },
            { key: 'gender', header: this.headers['gender'] },
            { key: 'address', header: this.headers['address'] }
        ];
    }

    protected override addBody(sheet: ExcelJS.Worksheet): ExcelJS.Worksheet {
        this.doctors.map((doctor) => {
            sheet.addRow({
                doctorId: doctor.doctorId,
                fullname: `${doctor.firstName} ${doctor.lastFathName} ${doctor.lastMontName}`,
                clinic: doctor.clinic,
                birthDate: doctor.birthDate.toLocaleDateString('en-GB'),
                email: doctor.email,
                gender: doctor.genderOption?.label,
                address: `${doctor.address}. ${this.data['cp']} ${doctor.postalCode}. ${doctor.state}`
            });
        });
        return sheet
    }

}
