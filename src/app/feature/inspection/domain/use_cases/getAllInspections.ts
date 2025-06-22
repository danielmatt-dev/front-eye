import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { InspectionWithDiseasesEntity } from '../entity/inspection-with-diseases.entity';

@Injectable({ providedIn: 'root' })
export class GetAllInspections implements UseCase<InspectionWithDiseasesEntity, NoParams> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, InspectionWithDiseasesEntity>> {
        return this.remote.getAllInspections()
    }

}
