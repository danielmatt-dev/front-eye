import { UseCase } from '../../../../shared/utils/usecase';
import { Either } from 'fp-ts/lib/Either';
import { Injectable } from '@angular/core';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { PatientResponseModel } from '../../data/models/patient.response.model';
import { PatientRequestModel } from '../../data/models/patient.request.model';

@Injectable({ providedIn: 'root' })
export class UpdatePatient implements UseCase<PatientResponseModel, PutPatientParams> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    async call(params: PutPatientParams): Promise<Either<Error, PatientResponseModel>> {
        return await this.remote.putPatient(params.request, params.patientId)
    }

}

export class PutPatientParams {

    request: PatientRequestModel
    patientId: number

    constructor(
        request: PatientRequestModel,
        patientId: number
    ) {
        this.request = request
        this.patientId = patientId
    }

}
