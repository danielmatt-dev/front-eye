import { Expose, Type } from 'class-transformer';

export class PatientWithInspectionsModel {

    @Expose({ name: 'patient_id' })
    patientId: number

    @Expose({ name: 'full_name' })
    fullName: string

    latitude: number

    longitude: number

    @Expose({ name: 'patient_created_at' })
    @Type(() => Date)
    patientCreatedAt: Date

    @Expose({ name: 'last_inspection_id' })
    lastInspectionId: number

    @Expose({ name: 'last_result' })
    lastResult: string

    @Expose({ name: 'last_disease' })
    lastDisease: string

    @Expose({ name: 'last_inspection_date' })
    @Type(() => Date)
    lastInspectionDate: Date

    @Expose({ name: 'inspection_count' })
    inspectionCount: number

    constructor(options: {
        patientId?: number
        fullName?: string
        latitude?: number
        longitude?: number
        patientCreatedAt?: Date
        lastInspectionId?: number
        lastResult?: string
        lastDisease?: string
        lastInspectionDate?: Date
        inspectionCount?: number
    } = {}) {
        this.patientId = options.patientId || 0
        this.fullName = options.fullName || ''
        this.latitude = options.latitude || 0.0
        this.longitude = options.longitude || 0.0
        this.patientCreatedAt = options.patientCreatedAt || new Date()
        this.lastInspectionId = options.lastInspectionId || 0
        this.lastResult = options.lastResult || ''
        this.lastDisease = options.lastDisease || ''
        this.lastInspectionDate = options.lastInspectionDate || new Date()
        this.inspectionCount = options.inspectionCount || 0
    }

}
