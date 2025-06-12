import { Expose } from 'class-transformer';

export class DoctorIdRequestModel {

    @Expose({ name: 'doctor_id' })
    doctorId: number = 0

    constructor(partial?: Partial<DoctorIdRequestModel>) {
        Object.assign(this, partial)
    }

}
