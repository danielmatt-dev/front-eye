import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorResponseEntity } from '../entity/doctor.response.entity';
import { DoctorRequestEntity } from '../entity/doctor.request.entity';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UpdateDoctor implements UseCase<DoctorResponseEntity, UpdateDoctorParams> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(params: UpdateDoctorParams): Promise<Either<Error, DoctorResponseEntity>> {
        return this.remote.putDoctor(params.doctorId, params.request)
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
