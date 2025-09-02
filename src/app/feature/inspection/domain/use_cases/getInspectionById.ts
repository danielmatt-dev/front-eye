import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { InspectionDetailsModel } from '../../data/models/inspection.details.model';

@Injectable({ providedIn: 'root' })
export class GetInspectionById implements UseCase<InspectionDetailsModel, number> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    call(params: number): Promise<Either<Error, InspectionDetailsModel>> {
        return this.remote.getInspectionByInspectionId(params)
    }

}
