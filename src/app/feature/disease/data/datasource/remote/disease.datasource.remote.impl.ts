import { Either } from 'fp-ts/lib/Either';
import { DiseaseModel } from '../../model/disease.model';
import { DiseaseDatasourceRemote } from '../disease.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../shared/services/api.service';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { DiseaseEndpoints } from './disease.endpoints';

@Injectable({ providedIn: 'root' })
export class DiseaseDatasourceRemoteImpl implements DiseaseDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    getAllDiseases(): Promise<Either<Error, DiseaseModel[]>> {
        const url = DiseaseEndpoints.PATH

        const obs$ = this.http
            .get<DiseaseModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(DiseaseModel, json)))
            )

        return this.apiService.sendRequest(obs$)
    }

}
