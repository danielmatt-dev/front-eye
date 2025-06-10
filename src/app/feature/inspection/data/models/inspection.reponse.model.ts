import { Expose, Type } from 'class-transformer';

export class InspectionReponseModel {

    @Expose({ name: 'inspection_id' })
    inspectionId: number

    @Expose({ name: 'patient_id' })
    patientId: number

    @Expose({ name: 'patient_birth_date' })
    @Type(() => Date)
    patientBirthDate: Date

    @Expose({ name: 'patient_gender' })
    patientGender: string

    @Expose({ name: 'inspection_date' })
    @Type(() => Date)
    inspectionDate: Date

    @Expose({ name: 'inspection_time' })
    inspectionTime: string

    eye: string

    disease: string

    model: string

    result: string

    @Expose({ name: 'created_at' })
    createdAt: Date

    constructor(options: {
        inspectionId?: number
        patientId?: number
        patientBirthDate?: Date
        patientGender?: string
        inspectionDate?: Date
        inspectionTime?: string
        eye?: string
        disease?: string
        model?: string
        result?: string
        createdAt?: Date
    } = {}) {
        this.inspectionId = options.inspectionId || 0
        this.patientId = options.patientId || 0
        this.patientBirthDate = options.patientBirthDate || new Date()
        this.patientGender = options.patientGender || ''
        this.inspectionDate = options.inspectionDate || new Date()
        this.inspectionTime = options.inspectionTime || ''
        this.eye = options.eye || ''
        this.disease = options.disease || ''
        this.model = options.model || ''
        this.result = options.result || ''
        this.createdAt = options.createdAt || new Date()
    }

}
