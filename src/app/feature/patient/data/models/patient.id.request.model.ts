import { Expose } from 'class-transformer';

export class PatientIdRequestModel {

    @Expose({ name: 'patient_id' })
    patientId: number = 0

    constructor(partial?: Partial<PatientIdRequestModel>) {
        Object.assign(this, partial)
    }

}
