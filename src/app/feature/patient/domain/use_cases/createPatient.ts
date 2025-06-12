import { UseCase } from '../../../../shared/utils/usecase';
import { PatientResponseEntity } from '../entity/patient.response.entity';
import { PatientRequestEntity } from '../entity/patient.request.entity';
import { Either } from 'fp-ts/lib/Either';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreatePatient implements UseCase<PatientResponseEntity, PatientRequestEntity> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(params: PatientRequestEntity): Promise<Either<Error, PatientResponseEntity>> {
        return this.remote.postPatient(params)
    }

}
