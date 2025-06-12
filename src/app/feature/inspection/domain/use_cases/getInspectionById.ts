import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionDetailsEntity } from '../entity/inspection.details.entity';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetInspectionById implements UseCase<InspectionDetailsEntity, number> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    call(params: number): Promise<Either<Error, InspectionDetailsEntity>> {
        return this.remote.getInspectionByInspectionId(params)
    }

}
