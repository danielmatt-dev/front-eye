import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionRequestEntity } from '../entity/inspection.request.entity';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';

@Injectable({ providedIn: 'root' })
export class CreateInspection implements UseCase<InspectionResponseModel, InspectionRequestEntity> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    async call(params: InspectionRequestEntity): Promise<Either<Error, InspectionResponseModel>> {
        return await this.remote.postInspection(params)
    }

}
