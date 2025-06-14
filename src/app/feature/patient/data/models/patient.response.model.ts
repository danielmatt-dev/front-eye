import { Expose, Type } from 'class-transformer';

export class PatientResponseModel {

    @Expose({ name: 'patient_id' })
    patientId: number = 0

    @Expose({ name: 'first_name' })
    firstName: string = ''

    @Expose({ name: 'last_fath_name' })
    lastFathName: string = ''

    @Expose({ name: 'last_mont_name' })
    lastMontName: string = ''

    email: string = ''

    phone: string = ''

    @Type(() => Date)
    @Expose({ name: 'birth_date' })
    birthDate: Date = new Date()

    age: number = 0

    gender: string = ''

    occupation: string = ''

    address: string = ''

    state: string = ''

    @Expose({ name: 'postal_code' })
    postalCode: string = ''

    @Type(() => Date)
    @Expose({ name: 'created_at' })
    createdAt: Date = new Date()

    @Type(() => Date)
    @Expose({ name: 'updated_at' })
    updatedAt: Date = new Date()

    constructor(partial?: Partial<PatientResponseModel>) {
        Object.assign(this, partial);
    }

}
