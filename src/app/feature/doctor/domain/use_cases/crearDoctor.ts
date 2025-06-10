import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorRequesEntity } from '../entity/doctor.reques.entity';
import { DoctorResponseEntity } from '../entity/doctor.response.entity';
import { Injectable } from '@angular/core';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';

// <>
@Injectable({ providedIn: 'root' })
export class CrearDoctor implements UseCase<DoctorResponseEntity, DoctorRequesEntity> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(params: DoctorRequesEntity): Promise<Either<Error, DoctorResponseEntity>> {
        return await this.remote.postDoctor(params)
    }

}
