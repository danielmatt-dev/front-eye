import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { DoctorResponseEntity } from '../entity/doctor.response.entity';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetAllDoctors implements UseCase<DoctorResponseEntity[], NoParams> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, DoctorResponseEntity[]>> {
        return await this.remote.getAllDoctors()
    }

}
