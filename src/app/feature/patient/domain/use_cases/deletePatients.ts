import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { PatientIdRequestModel } from '../../data/models/patient.id.request.model';

@Injectable({ providedIn: 'root' })
export class DeletePatients implements UseCase<boolean, number[]> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(params: number[]): Promise<Either<Error, boolean>> {
        const patientIds = params.map(id =>
            new PatientIdRequestModel({patientId: id}))
        return this.remote.deletePatients(patientIds)
    }

}
