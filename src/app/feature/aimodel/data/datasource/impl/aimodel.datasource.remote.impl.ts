import { AiModelModel } from '../../model/aimodel.model';
import { AimodelDatasourceRemote } from '../aimodel.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../shared/services/api.service';
import { AimodelEndpoints } from './aimodel.endpoints';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { Either } from 'fp-ts/Either';

@Injectable({ providedIn: 'root' })
export class AimodelDatasourceRemoteImpl implements AimodelDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    getAllModels(): Promise<Either<Error, AiModelModel[]>> {

        const url = AimodelEndpoints.PATH

        const obs$ = this.http
            .get<AiModelModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(AiModelModel, json)))
            )

        return this.apiService.sendRequest(obs$)
    }

}
