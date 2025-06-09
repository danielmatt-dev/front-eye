import { DoctorResponseModel } from '../../data/models/doctor.response.model';

export class DoctorResponseEntity extends DoctorResponseModel{

    constructor(options: {
        doctorId?: number,
        firstName?: string,
        lastFathName?: string,
        lastMontName?: string,
        email?: string,
        birthDate?: Date,
        age?: number,
        gender?: string,
        address?: string,
        state?: string,
        postalCode?: string,
        clinicId?: number,
        clinic?: string,
        clinicDescription?: string,
        createdAt?: Date,
        updatedAt?: Date
    } = {}) {
        super({
            doctorId: options.doctorId,
            firstName: options.firstName,
            lastFathName: options.lastFathName,
            lastMontName: options.lastMontName,
            email: options.email,
            birthDate: options.birthDate,
            age: options.age,
            gender: options.gender,
            address: options.address,
            state: options.state,
            postalCode: options.postalCode,
            clinicId: options.clinicId,
            clinic: options.clinic,
            clinicDescription: options.clinicDescription,
            createdAt: options.createdAt,
            updatedAt: options.updatedAt
        });
    }

}
