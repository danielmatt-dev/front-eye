import { Expose } from 'class-transformer';

export class DoctorResponseModel {

    @Expose({ name: 'doctor_id' })
    doctorId: number

    @Expose({ name: 'first_name' })
    firstName: string

    @Expose({ name: 'last_fath_name' })
    lastFathName: string

    @Expose({ name: 'last_mont_name' })
    lastMontName: string

    email: string

    @Expose({ name: 'birth_date' })
    birthDate: Date

    age: number

    gender: string

    address: string

    state: string

    @Expose({ name: 'postal_code' })
    postalCode: string

    @Expose({ name: 'clinic_id' })
    clinicId: number

    clinic: string

    @Expose({ name: 'clinic_description' })
    clinicDescription: string

    @Expose({ name: 'created_at' })
    createdAt: Date

    @Expose({ name: 'updated_at' })
    updatedAt: Date

    constructor(options: {
        doctorId?: number
        firstName?: string
        lastFathName?: string
        lastMontName?: string
        email?: string
        birthDate?: Date
        age?: number
        gender?: string
        address?: string
        state?: string
        postalCode?: string
        clinicId?: number
        clinic?: string
        clinicDescription?: string
        createdAt?: Date
        updatedAt?: Date
    } = {}) {
        this.doctorId = options.doctorId || 0
        this.firstName = options.firstName || ''
        this.lastFathName = options.lastFathName || ''
        this.lastMontName = options.lastMontName || ''
        this.email = options.email || ''
        this.birthDate = options.birthDate || new Date()
        this.age = options.age || 0
        this.gender = options.gender || ''
        this.address = options.address || ''
        this.state = options.state || ''
        this.postalCode = options.postalCode || ''
        this.clinicId = options.clinicId || 0
        this.clinic = options.clinic || ''
        this.clinicDescription = options.clinicDescription || ''
        this.createdAt = options.createdAt || new Date()
        this.updatedAt = options.updatedAt  || new Date()
    }

}
