import { DoctorDatasourceRemote } from '../doctor.datasource.remote';
import { DoctorResponseModel } from '../../../models/doctor.response.model';
import { Either } from 'fp-ts/Either';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { DoctorEndpoints } from '../doctor.endpoints';

@Injectable({ providedIn: 'root' })
export class DoctorDatasourceRemoteImpl implements DoctorDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    getAllDoctors(): Promise<Either<Error, DoctorResponseModel[]>> {
        const url = DoctorEndpoints.PATH
        const obs$ = this.http
            .get<DoctorResponseModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(DoctorResponseModel, json)))
            )

        return this.apiService.sendRequest<DoctorResponseModel[]>(obs$)
    }

}
