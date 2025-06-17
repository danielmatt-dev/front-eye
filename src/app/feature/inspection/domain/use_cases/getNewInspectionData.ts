import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { NewInspectionDataEntity } from '../entity/new.inspection.data.entity';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';

@Injectable({ providedIn: 'root' })
export class GetNewInspectionData implements UseCase<NewInspectionDataEntity, NoParams> {

    constructor(
        private readonly remote: InspectionsDatasourceRemoteImpl
    ) {}

    call(_: NoParams): Promise<Either<Error, NewInspectionDataEntity>> {
        return this.remote.getDataNewInspection()
    }

}
