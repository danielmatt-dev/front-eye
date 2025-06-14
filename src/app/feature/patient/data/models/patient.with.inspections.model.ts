import { Expose, Type } from 'class-transformer';

export class PatientWithInspectionsModel {

    @Expose({ name: 'patient_id' })
    patientId: number = 0

    @Expose({ name: 'full_name' })
    fullName: string = ''

    latitude: number = 0.0

    longitude: number = 0.0

    @Expose({ name: 'patient_created_at' })
    @Type(() => Date)
    patientCreatedAt: Date = new Date()

    @Expose({ name: 'last_inspection_id' })
    lastInspectionId: number = 0

    @Expose({ name: 'last_result' })
    lastResult: string = ''

    @Expose({ name: 'last_disease' })
    lastDisease: string = ''

    @Expose({ name: 'last_inspection_date' })
    @Type(() => Date)
    lastInspectionDate: Date = new Date()

    @Expose({ name: 'inspection_count' })
    inspectionCount: number = 0

    constructor(partial?: Partial<PatientWithInspectionsModel>) {
        Object.assign(this, partial)
    }

}
