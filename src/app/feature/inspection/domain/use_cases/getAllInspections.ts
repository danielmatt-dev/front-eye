import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { InspectionResponseEntity } from '../entity/inspection.response.entity';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';

@Injectable({ providedIn: 'root' })
export class GetAllInspections implements UseCase<InspectionResponseEntity[], NoParams> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, InspectionResponseEntity[]>> {
        return this.remote.getAllInspections()
    }

}
