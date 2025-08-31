import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';

@Injectable({ providedIn: 'root' })
export class GetAllDoctors implements UseCase<DoctorResponseModel[], NoParams> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, DoctorResponseModel[]>> {
        return await this.remote.getAllDoctors()
    }

}
