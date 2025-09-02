import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { InspectionRequestModel } from '../../data/models/inspection.request.model';

@Injectable({ providedIn: 'root' })
export class CreateInspection implements UseCase<InspectionResponseModel, InspectionRequestModel> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    async call(params: InspectionRequestModel): Promise<Either<Error, InspectionResponseModel>> {
        return await this.remote.postInspection(params)
    }

}
