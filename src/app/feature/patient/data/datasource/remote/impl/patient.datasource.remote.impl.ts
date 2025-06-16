import { Either } from 'fp-ts/lib/Either';
import { PatientWithInspectionsModel } from '../../../models/patient.with.inspections.model';
import { PatientDatasourceRemote } from '../patient.datasource.remote';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { PatientEndpoints } from '../patient.endpoints';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PatientRequestModel } from '../../../models/patient.request.model';
import { PatientResponseModel } from '../../../models/patient.response.model';
import { PatientIdRequestModel } from '../../../models/patient.id.request.model';

// <>
@Injectable({ providedIn: 'root' })
export class PatientDatasourceRemoteImpl implements PatientDatasourceRemote {
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    postPatient(request: PatientRequestModel): Promise<Either<Error, PatientResponseModel>> {
        const url = PatientEndpoints.PATH
        const obs$ = this.http
            .post<PatientResponseModel>(url, instanceToPlain(request))
            .pipe(
                map(response =>
                    plainToInstance(PatientResponseModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    putPatient(request: PatientRequestModel, patientId: number): Promise<Either<Error, PatientResponseModel>> {
        const url = `${PatientEndpoints.PATH}/${patientId}`

        const obs$ = this.http
            .put<PatientResponseModel>(url, instanceToPlain(request))
            .pipe(
                map(response =>
                    plainToInstance(PatientResponseModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    getPatientById(patientId: number): Promise<Either<Error, PatientResponseModel>> {
        const url = `${PatientEndpoints.PATH}/${patientId}`
        const obs$ = this.http
            .get<PatientResponseModel>(url)
            .pipe(
                map(response =>
                    plainToInstance(PatientResponseModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    getAllPatients(): Promise<Either<Error, PatientResponseModel[]>> {
        const url = PatientEndpoints.PATH
        const obs$ = this.http
            .get<PatientResponseModel[]>(url)
            .pipe(
                map(response =>
                        response.map(json =>
                            plainToInstance(PatientResponseModel, json))))

        return this.apiService.sendRequest(obs$)
    }

    deletePatients(patientIds: PatientIdRequestModel[]): Promise<Either<Error, boolean>> {
        const url = PatientEndpoints.PATH
        const body = instanceToPlain(patientIds)
        
        const obs$ = this.http
            .delete<boolean>(url, { body })
            .pipe(
                map(() => true))

        return this.apiService.sendRequest(obs$)
    }

    getAllPatientsWithInspections(): Promise<Either<Error, PatientWithInspectionsModel[]>> {
        const url = PatientEndpoints.PATH;
        const obs$ = this.http
            .get<PatientWithInspectionsModel[]>(url)
            .pipe(
                map(response =>
                    response.map((json) =>
                        plainToInstance(PatientWithInspectionsModel, json))));

        return this.apiService.sendRequest(obs$);
    }

}
