import { Expose, Type } from 'class-transformer';

export class DoctorResponseModel {

    @Expose({ name: 'doctor_id' })
    doctorId: number = 0

    @Expose({ name: 'first_name' })
    firstName: string = ''

    @Expose({ name: 'last_fath_name' })
    lastFathName: string = ''

    @Expose({ name: 'last_mont_name' })
    lastMontName: string = ''

    email: string = ''

    @Expose({ name: 'birth_date' })
    @Type(() => Date)
    birthDate: Date = new Date()

    age: number = 0

    gender: string = ''

    address: string = ''

    state: string = ''

    @Expose({ name: 'postal_code' })
    postalCode: string = ''

    @Expose({ name: 'clinic_id' })
    clinicId: number = 0

    clinic: string = ''

    @Expose({ name: 'clinic_description' })
    clinicDescription: string = ''

    @Expose({ name: 'created_at' })
    @Type(() => Date)
    createdAt?: Date

    @Expose({ name: 'updated_at' })
    @Type(() => Date)
    updatedAt?: Date

    constructor(partial?: Partial<DoctorResponseModel>) {
        Object.assign(this, partial)
    }

}
