import { Expose, Type } from 'class-transformer';

export class InspectionResponseModel {

    @Expose({ name: 'inspection_id' })
    inspectionId: number = 0

    @Expose({ name: 'patient_id' })
    patientId: number = 0

    @Expose({ name: 'patient_birth_date' })
    @Type(() => Date)
    patientBirthDate: Date = new Date()

    @Expose({ name: 'patient_gender' })
    patientGender: string = ''

    patientAge: number = 0

    @Expose({ name: 'inspection_date' })
    @Type(() => Date)
    inspectionDate: Date = new Date()

    @Expose({ name: 'inspection_time' })
    inspectionTime: string = ''

    eye: string = ''

    disease: string = ''

    model: string = ''

    result: string = ''

    notes: string = ''

    @Expose({ name: 'created_at' })
    createdAt: Date = new Date()

    constructor(partial?: Partial<InspectionResponseModel>) {
        Object.assign(this, partial)
    }

    get inspectionDateTime(): Date {
        // Copiamos la fecha para no mutar inspectionDate original
        const dt = new Date(this.inspectionDate);
        if (this.inspectionTime) {
            const [h, m, s] = this.inspectionTime
                .split(':')
                .map(part => parseInt(part, 10));
            dt.setHours(h, m, s);
        }
        return dt;
    }

}
