import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { DiseaseDatasourceRemoteImpl } from '../../data/datasource/remote/disease.datasource.remote.impl';
import { DiseaseEntity } from '../entity/disease.entity';

@Injectable({ providedIn: 'root' })
export class GetAllDiseases implements UseCase<DiseaseEntity[], NoParams> {

    constructor(
        private readonly remote: DiseaseDatasourceRemoteImpl
    ) {}

    call(_: NoParams): Promise<Either<Error, DiseaseEntity[]>> {
        return this.remote.getAllDiseases()
    }
    
}
