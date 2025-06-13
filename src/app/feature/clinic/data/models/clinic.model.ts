import { Expose } from 'class-transformer';

export class ClinicModel {

    @Expose({ name: 'clinic_id' })
    clinicId: number = 1

    name: string = ''

    description: string = ''

    constructor(partial?: Partial<ClinicModel>) {
        Object.assign(this, partial)
    }

}
