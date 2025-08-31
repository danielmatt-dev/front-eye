import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { PatientResponseModel } from '../../data/models/patient.response.model';

@Injectable({ providedIn: 'root' })
export class GetPatientById implements UseCase<PatientResponseModel, number> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    async call(params: number): Promise<Either<Error, PatientResponseModel>> {
        return await this.remote.getPatientById(params)
    }

}
