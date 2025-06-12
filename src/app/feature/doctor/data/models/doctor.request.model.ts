import { Expose, Type } from 'class-transformer';

export class DoctorRequestModel {

    @Expose({ name: 'clinic_id' })
    clinicId?: number

    @Expose({ name: 'first_name' })
    firstName: string

    @Expose({ name: 'last_fath_name' })
    lastFathName: string

    @Expose({ name: 'last_mont_name' })
    lastMontName: string

    @Expose({ name: 'birth_date' })
    @Type(() => Date)
    birthDate: Date

    gender: string

    address: string

    state: string

    @Expose({ name: 'postal_code' })
    postalCode: string

    email: string

    constructor(options: {
        clinicId?: number
        firstName?: string
        lastFathName?: string
        lastMontName?: string
        birthDate?: Date
        gender?: string
        address?: string
        state?: string
        postalCode?: string
        email?: string
    } = {}) {
        this.clinicId = options.clinicId
        this.firstName = options.firstName ?? ''
        this.lastFathName = options.lastFathName ?? ''
        this.lastMontName = options.lastMontName ?? ''
        this.birthDate = options.birthDate ?? new Date()
        this.gender = options.gender ?? ''
        this.address = options.address ?? ''
        this.state = options.state ?? ''
        this.postalCode = options.postalCode ?? ''
        this.email = options.email ?? ''
    }
}
