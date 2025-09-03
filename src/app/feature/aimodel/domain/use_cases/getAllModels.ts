import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { AimodelDatasourceRemoteImpl } from '../../data/datasource/impl/aimodel.datasource.remote.impl';
import { AiModelModel } from '../../data/model/aimodel.model';

@Injectable({ providedIn: 'root' })
export class GetAllModels implements UseCase<AiModelModel[], NoParams> {

    constructor(
        private readonly remote: AimodelDatasourceRemoteImpl
    ) {}

    call(_: NoParams): Promise<Either<Error, AiModelModel[]>> {
        return this.remote.getAllModels()
    }

}
