import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { PatientWithInspectionsEntity } from '../entity/patient.with.inspections.entity';
import { Injectable } from '@angular/core';
import { PatientDatasourceRemoteImpl } from '../../data/datasource/remote/impl/patient.datasource.remote.impl';

@Injectable({ providedIn: 'root' })
export class GetAllPatientsWithInspections implements UseCase<PatientWithInspectionsEntity[], NoParams> {

    constructor(private readonly remote: PatientDatasourceRemoteImpl) {}

    call(_: NoParams): Promise<Either<Error, PatientWithInspectionsEntity[]>> {
        return this.remote.getAllPatientsWithInspections()
    }

}
