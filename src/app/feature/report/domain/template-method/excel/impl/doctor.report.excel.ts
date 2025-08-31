import { AbstractReportExcel } from '../abstract.report.excel';
import ExcelJS from 'exceljs';
import { DoctorResponseModel } from '../../../../../doctor/data/models/doctor.response.model';

export class DoctorReportExcel extends AbstractReportExcel {

    doctors: DoctorResponseModel[] = [];

    constructor(partial?: Partial<DoctorReportExcel>) {
        super();
        Object.assign(this, partial);
    }

    protected override getWorksheetName(): string {
        return 'Doctores'
    }

    protected override getFileName(): string {
        return 'reporte_doctores';
    }

    protected override addHeaders(): { key: string, header: string }[] {
        return [
            { key: 'doctorId', header: 'ID' },
            { key: 'fullname', header: 'Nombre' },
            { key: 'clinic', header: 'Clínica' },
            { key: 'birthDate', header: 'Fecha de nacimiento' },
            { key: 'email', header: 'Correo' },
            { key: 'gender', header: 'Género' },
            { key: 'address', header: 'Dirección' }
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
                gender: doctor.gender,
                address: `${doctor.address}. cp ${doctor.postalCode}. ${doctor.state}`
            });
        });
        return sheet
    }

}
