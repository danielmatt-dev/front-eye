import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { ClinicDatasourceRemoteImpl } from '../../data/datasource/remote/impl/clinic.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { ClinicModel } from '../../data/models/clinic.model';

@Injectable({ providedIn: 'root' })
export class GetAllClinics implements UseCase<ClinicModel[], NoParams> {

    constructor(private readonly remote: ClinicDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, ClinicModel[]>> {
        return await this.remote.getAllClinics()
    }

}
