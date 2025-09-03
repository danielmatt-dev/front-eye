import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { DiseaseDatasourceRemoteImpl } from '../../data/datasource/remote/disease.datasource.remote.impl';
import { DiseaseModel } from '../../data/model/disease.model';

@Injectable({ providedIn: 'root' })
export class GetAllDiseases implements UseCase<DiseaseModel[], NoParams> {

    constructor(
        private readonly remote: DiseaseDatasourceRemoteImpl
    ) {}

    call(_: NoParams): Promise<Either<Error, DiseaseModel[]>> {
        return this.remote.getAllDiseases()
    }

}
