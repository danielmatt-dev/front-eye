import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { DoctorResponseEntity } from '../../../../../doctor/domain/entity/doctor.response.entity';
import { formatDateToDDMMYYYY } from '../../../../../../shared/utils/functions/functions';

export class DoctorReportPdf extends AbstractReportPdf {

    doctors: DoctorResponseEntity[] = []

    constructor(partial?: Partial<DoctorReportPdf>) {
        super();
        Object.assign(this, partial)
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            ['ID', 'Nombre', 'Clínica', 'Fecha de nacimiento', 'Correo', 'Género', 'Dirección']
        ]
    }

    protected override getBody(): RowInput[] {
        return this.doctors.map(doctor => [
            doctor.doctorId.toString(),
            `${doctor.firstName} ${doctor.lastFathName} ${doctor.lastMontName}`,
            doctor.clinic,
            formatDateToDDMMYYYY(doctor.birthDate),
            doctor.email,
            doctor.gender,
            `${doctor.address}. cp ${doctor.postalCode}. ${doctor.state}`
        ])
    }

}
