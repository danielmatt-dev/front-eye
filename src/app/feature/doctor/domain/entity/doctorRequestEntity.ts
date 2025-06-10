import { DoctorRequestModel } from '../../data/models/doctor.request.model';

export class DoctorRequestEntity extends DoctorRequestModel{

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
        password?: string
    } = {}) {
        super({
            clinicId: options.clinicId,
            firstName: options.firstName,
            lastFathName: options.lastFathName,
            lastMontName: options.lastMontName,
            birthDate: options.birthDate,
            gender: options.gender,
            address: options.address,
            state: options.state,
            postalCode: options.postalCode,
            email: options.email,
            password: options.password
        });
    }

}
