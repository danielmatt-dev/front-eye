import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorRequestEntity } from '../entity/doctor.request.entity';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';

@Injectable({ providedIn: 'root' })
export class UpdateDoctor implements UseCase<DoctorResponseModel, UpdateDoctorParams> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(params: UpdateDoctorParams): Promise<Either<Error, DoctorResponseModel>> {
        return await this.remote.putDoctor(params.doctorId, params.request)
    }

}

export class UpdateDoctorParams {

    request: DoctorRequestEntity
    doctorId: number

    constructor(request: DoctorRequestEntity, doctorId: number) {
        this.request = request
        this.doctorId = doctorId
    }

}
