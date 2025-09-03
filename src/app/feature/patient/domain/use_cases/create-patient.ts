import { UseCase } from '../../../../shared/utils/usecase';
import { Either } from 'fp-ts/lib/Either';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { PatientResponseModel } from '../../data/models/patient.response.model';
import { PatientRequestModel } from '../../data/models/patient.request.model';

@Injectable({ providedIn: 'root' })
export class CreatePatient implements UseCase<PatientResponseModel, PatientRequestModel> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    async call(params: PatientRequestModel): Promise<Either<Error, PatientResponseModel>> {
        return await this.remote.postPatient(params)
    }

}
