import { Either } from 'fp-ts/lib/Either';
import { InspectionReponseModel } from '../../../models/inspection.reponse.model';
import { InspectionDatasourceRemote } from '../inspection.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { InspectionsEndpoints } from '../inspections.endpoints';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// <>
@Injectable({ providedIn: 'root' })
export class InspectionsDatasourceRemoteImpl implements InspectionDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    getAllInspections(): Promise<Either<Error, InspectionReponseModel[]>> {
        const url = InspectionsEndpoints.PATH
        const obs$ = this.http
            .get<InspectionReponseModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(InspectionReponseModel, json))))

        return this.apiService.sendRequest(obs$)
    }

}
