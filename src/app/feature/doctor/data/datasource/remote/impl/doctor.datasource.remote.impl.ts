import { DoctorDatasourceRemote } from '../doctor.datasource.remote';
import { DoctorResponseModel } from '../../../models/doctor.response.model';
import { Either } from 'fp-ts/Either';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { DoctorEndpoints } from '../doctor.endpoints';
import { DoctorRequestModel } from '../../../models/doctor.request.model';

// <>
@Injectable({ providedIn: 'root' })
export class DoctorDatasourceRemoteImpl implements DoctorDatasourceRemote {
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    postDoctor(request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>> {
        const url = DoctorEndpoints.PATH
        const obs$ = this.http
            .post<DoctorResponseModel>(url, instanceToPlain(request))
            .pipe(
                map(response =>
                    plainToInstance(DoctorResponseModel, response)))

        return this.apiService.sendRequest<DoctorResponseModel>(obs$)
    }

    putDoctor(doctorId: number, request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>> {
        const url = `${DoctorEndpoints.PATH}/${doctorId}`
        const obs$ = this.http
            .put<DoctorResponseModel>(url, instanceToPlain(request))
            .pipe(
                map(response =>
                    plainToInstance(DoctorResponseModel, response)))

        return this.apiService.sendRequest<DoctorResponseModel>(obs$)
    }

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

    deleteDoctor(doctorId: number): Promise<Either<Error, boolean>> {
        const url = `${DoctorEndpoints.PATH}/${doctorId}`
        const obs$ = this.http
            .delete(url)
            .pipe(
                map(() => true))

        return this.apiService.sendRequest<boolean>(obs$)
    }

}
