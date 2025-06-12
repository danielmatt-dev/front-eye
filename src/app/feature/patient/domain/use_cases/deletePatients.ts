import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeletePatients implements UseCase<boolean, number[]> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(params: number[]): Promise<Either<Error, boolean>> {
        return this.remote.deletePatients(params)
    }

}
