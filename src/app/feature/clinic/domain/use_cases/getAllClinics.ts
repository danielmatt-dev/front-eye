import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { ClinicEntity } from '../entity/clinic.entity';
import { ClinicDatasourceRemoteImpl } from '../../data/datasource/remote/impl/clinic.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetAllClinics implements UseCase<ClinicEntity[], NoParams> {

    constructor(private readonly remote: ClinicDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, ClinicEntity[]>> {
        return await this.remote.getAllClinics()
    }

}
