import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorRequestEntity } from '../entity/doctor.request.entity';
import { DoctorResponseEntity } from '../entity/doctor.response.entity';
import { Injectable } from '@angular/core';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';

// <>
@Injectable({ providedIn: 'root' })
export class CreateDoctor implements UseCase<DoctorResponseEntity, DoctorRequestEntity> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(params: DoctorRequestEntity): Promise<Either<Error, DoctorResponseEntity>> {
        return await this.remote.postDoctor(params)
    }

}
