import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorRequestEntity } from '../entity/doctor.request.entity';
import { Injectable } from '@angular/core';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';

// <>
@Injectable({ providedIn: 'root' })
export class CreateDoctor implements UseCase<DoctorResponseModel, DoctorRequestEntity> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(params: DoctorRequestEntity): Promise<Either<Error, DoctorResponseModel>> {
        return await this.remote.postDoctor(params)
    }

}
