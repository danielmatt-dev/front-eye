import { Expose, Type } from 'class-transformer';

export class DoctorRequestModel {

    @Expose({ name: 'clinic_id' })
    clinicId?: number

    @Expose({ name: 'first_name' })
    firstName: string = ''

    @Expose({ name: 'last_fath_name' })
    lastFathName: string = ''

    @Expose({ name: 'last_mont_name' })
    lastMontName: string = ''

    @Expose({ name: 'birth_date' })
    @Type(() => Date)
    birthDate: Date = new Date()

    gender: string = ''

    address: string = ''

    state: string = ''

    @Expose({ name: 'postal_code' })
    postalCode: string = ''

    email: string = ''

    constructor(partial?: Partial<DoctorRequestModel>) {
        Object.assign(this, partial)
    }

}
