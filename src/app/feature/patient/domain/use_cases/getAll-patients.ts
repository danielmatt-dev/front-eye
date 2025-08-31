import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { PatientResponseModel } from '../../data/models/patient.response.model';

@Injectable({ providedIn: 'root' })
export class GetAllPatients implements UseCase<PatientResponseModel[], NoParams> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, PatientResponseModel[]>> {
        return await this.remote.getAllPatients()
    }

}
