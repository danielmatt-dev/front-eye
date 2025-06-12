import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { PatientResponseEntity } from '../entity/patient.response.entity';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetAllPatients implements UseCase<PatientResponseEntity[], NoParams> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(_: NoParams): Promise<Either<Error, PatientResponseEntity[]>> {
        return this.remote.getAllPatients()
    }

}
