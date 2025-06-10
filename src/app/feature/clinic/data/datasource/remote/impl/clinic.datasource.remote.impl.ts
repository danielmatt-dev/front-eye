import { Either } from 'fp-ts/lib/Either';
import { ClinicModel } from '../../../models/clinic.model';
import { ClinicDatasourceRemote } from '../clinic.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { ClinicEndpoints } from '../clinic.endpoints';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// <>
@Injectable({ providedIn: 'root' })
export class ClinicDatasourceRemoteImpl implements ClinicDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    getAllClinics(): Promise<Either<Error, ClinicModel[]>> {
        const url = ClinicEndpoints.PATH
        const obs$ = this.http
            .get<ClinicModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json => plainToInstance(ClinicModel, json))))

        return this.apiService.sendRequest(obs$)
    }

}
