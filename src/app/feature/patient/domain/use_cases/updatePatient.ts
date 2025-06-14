import { UseCase } from '../../../../shared/utils/usecase';
import { PatientResponseEntity } from '../entity/patient.response.entity';
import { PatientRequestEntity } from '../entity/patient.request.entity';
import { Either } from 'fp-ts/lib/Either';
import { Injectable } from '@angular/core';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';

@Injectable({ providedIn: 'root' })
export class UpdatePatient implements UseCase<PatientResponseEntity, PutPatientParams> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(params: PutPatientParams): Promise<Either<Error, PatientResponseEntity>> {
        return this.remote.putPatient(params.request, params.patientId)
    }

}

export class PutPatientParams {

    request: PatientRequestEntity
    patientId: number

    constructor(
        request: PatientRequestEntity,
        patientId: number
    ) {
        this.request = request
        this.patientId = patientId
    }

}
