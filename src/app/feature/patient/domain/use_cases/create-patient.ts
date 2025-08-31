import { UseCase } from '../../../../shared/utils/usecase';
import { PatientRequestEntity } from '../entity/patient.request.entity';
import { Either } from 'fp-ts/lib/Either';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { PatientResponseModel } from '../../data/models/patient.response.model';

@Injectable({ providedIn: 'root' })
export class CreatePatient implements UseCase<PatientResponseModel, PatientRequestEntity> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    async call(params: PatientRequestEntity): Promise<Either<Error, PatientResponseModel>> {
        return await this.remote.postPatient(params)
    }

}
