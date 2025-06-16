import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionRequestEntity } from '../entity/inspection.request.entity';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateInspection implements UseCase<boolean, InspectionRequestEntity> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    call(params: InspectionRequestEntity): Promise<Either<Error, boolean>> {
        return this.remote.postInspection(params)
    }

}
