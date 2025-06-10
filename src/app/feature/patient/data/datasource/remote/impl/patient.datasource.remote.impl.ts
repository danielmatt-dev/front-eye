import { Either } from 'fp-ts/lib/Either';
import { PatientWithInspectionsModel } from '../../../models/patient.with.inspections.model';
import { PatientDatasourceRemote } from '../patient.datasource.remote';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { PatientEndpoints } from '../patient.endpoints';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

// <>
@Injectable({ providedIn: 'root' })
export class PatientDatasourceRemoteImpl implements PatientDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService) {}

    getAllPatientsWithInspections(): Promise<Either<Error, PatientWithInspectionsModel[]>> {
        const url = PatientEndpoints.PATH
        const obs$ = this.http
            .get<PatientWithInspectionsModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(PatientWithInspectionsModel, json)))
            )

        return this.apiService.sendRequest(obs$)
    }

}
