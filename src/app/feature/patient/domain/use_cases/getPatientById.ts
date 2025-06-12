import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { PatientResponseEntity } from '../entity/patient.response.entity';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetPatientById implements UseCase<PatientResponseEntity, number> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(params: number): Promise<Either<Error, PatientResponseEntity>> {
        return this.remote.getPatientById(params)
    }

}
