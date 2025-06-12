import { Expose, Type } from 'class-transformer';

export class PatientRequestModel {

    @Expose({ name: 'first_name' })
    firstName: string = ''

    @Expose({ name: 'last_fath_name' })
    lastFathName: string = ''

    @Expose({ name: 'last_mont_name' })
    lastMontName: string = ''

    email: string = ''

    phone: string = ''

    @Expose({ name: 'birth_date' })
    @Type(() => Date)
    birthDate: Date = new Date()

    gender: string = ''

    occupation: string = ''

    address: string = ''

    state: string = ''

    @Expose({ name: 'postal_code' })
    postalCode: string = ''

    constructor(partial?: Partial<PatientRequestModel>) {
        Object.assign(this, partial)
    }

}
