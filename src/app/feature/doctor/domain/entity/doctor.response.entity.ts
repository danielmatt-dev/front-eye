import { DoctorResponseModel } from '../../data/models/doctor.response.model';

export class DoctorResponseEntity extends DoctorResponseModel{

    constructor(
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
    ) {
        super({
            doctorId: doctorId,
            firstName: firstName,
            lastFathName: lastFathName,
            lastMontName: lastMontName,
            email: email,
            birthDate: birthDate,
            age: age,
            gender: gender,
            address: address,
            state: state,
            postalCode: postalCode,
            clinicId: clinicId,
            clinic: clinic,
            clinicDescription: clinicDescription,
            createdAt: createdAt,
            updatedAt: updatedAt
        });
    }

}
