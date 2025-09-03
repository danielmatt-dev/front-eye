import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { NewInspectionDataModel } from '../../data/models/new.inspection.data.model';

@Injectable({ providedIn: 'root' })
export class GetNewInspectionData implements UseCase<NewInspectionDataModel, NoParams> {

    constructor(
        private readonly remote: InspectionsDatasourceRemoteImpl
    ) {}

    call(_: NoParams): Promise<Either<Error, NewInspectionDataModel>> {
        return this.remote.getDataNewInspection()
    }

}
