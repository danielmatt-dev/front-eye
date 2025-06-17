import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { AiModelEntity } from '../entity/aimodel.entity';
import { Injectable } from '@angular/core';
import { AimodelDatasourceRemoteImpl } from '../../data/datasource/impl/aimodel.datasource.remote.impl';

@Injectable({ providedIn: 'root' })
export class GetAllModels implements UseCase<AiModelEntity[], NoParams> {

    constructor(
        private readonly remote: AimodelDatasourceRemoteImpl
    ) {}

    call(_: NoParams): Promise<Either<Error, AiModelEntity[]>> {
        return this.remote.getAllModels()
    }

}
