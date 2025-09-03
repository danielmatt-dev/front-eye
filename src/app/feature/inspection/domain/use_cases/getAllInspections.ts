import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { InspectionsWithDiseasesModel } from '../../data/models/inspections-with-diseases.model';

@Injectable({ providedIn: 'root' })
export class GetAllInspections implements UseCase<InspectionsWithDiseasesModel, NoParams> {

    constructor(private readonly remote: InspectionsDatasourceRemoteImpl) {}

    async call(_: NoParams): Promise<Either<Error, InspectionsWithDiseasesModel>> {
        return this.remote.getAllInspections()
    }

}
