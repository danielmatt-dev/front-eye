import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';
import { PatientWithInspectionsModel } from '../../data/models/patient.with.inspections.model';

@Injectable({ providedIn: 'root' })
export class GetAllPatientsWithInspections implements UseCase<PatientWithInspectionsModel[], NoParams> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, PatientWithInspectionsModel[]>> {
        return await this.remote.getAllPatientsWithInspections()
    }

}
