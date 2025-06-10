import { DoctorResponseEntity } from '../../domain/entity/doctor.response.entity';
import { DoctorResponseModel } from '../models/doctor.response.model';
import { Injectable } from '@angular/core';
import { DoctorRequestModel } from '../models/doctor.request.model';
import { DoctorRequesEntity } from '../../domain/entity/doctor.reques.entity';

export interface DoctorMapper {

    toDoctorResponse(model: DoctorResponseModel): DoctorResponseEntity

    toDoctorRequestModel(entity: DoctorResponseEntity): DoctorRequestModel

    toListDoctorResponse(models: DoctorResponseModel[]): DoctorResponseEntity[]

}

@Injectable({ providedIn: 'root' })
export class DoctorMapperImpl implements DoctorMapper {

    toDoctorRequestModel(entity: DoctorRequesEntity): DoctorRequestModel {
        return new DoctorRequestModel({
            clinicId: entity.clinicId,
            firstName: entity.firstName,
            lastFathName: entity.lastFathName,
            lastMontName: entity.lastMontName,
            email: entity.email,
            birthDate: entity.birthDate,
            gender: entity.gender,
            address: entity.address,
            state: entity.state,
            postalCode: entity.postalCode,
            password: entity.password
        })
    }

    toDoctorResponse(model: DoctorResponseModel): DoctorResponseEntity {
        return new DoctorResponseEntity({
            doctorId: model.doctorId,
            firstName: model.firstName,
            lastFathName: model.lastFathName,
            lastMontName: model.lastMontName,
            email: model.email,
            birthDate: model.birthDate,
            age: model.age,
            gender: model.gender,
            address: model.address,
            state: model.state,
            postalCode: model.postalCode,
            clinicId: model.clinicId,
            clinic: model.clinic,
            clinicDescription: model.clinicDescription,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt
        })
    }

    toListDoctorResponse(models: DoctorResponseModel[]): DoctorResponseEntity[] {
        return models.map((model) => this.toDoctorResponse(model))
    }

}
