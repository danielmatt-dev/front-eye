import { Either } from 'fp-ts/lib/Either';
import { InspectionResponseModel } from '../../../models/inspectionResponseModel';
import { InspectionDatasourceRemote } from '../inspection.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { InspectionsEndpoints } from '../inspections.endpoints';
import { map } from 'rxjs/operators';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InspectionDetailsModel } from '../../../models/inspection.details.model';
import { InspectionRequestModel } from '../../../models/inspection.request.model';

// <>
@Injectable({ providedIn: 'root' })
export class InspectionsDatasourceRemoteImpl implements InspectionDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    postInspection(request: InspectionRequestModel): Promise<Either<Error, boolean>> {
        const url = InspectionsEndpoints.PATH
        const obs$ = this.http
            .post<boolean>(url, instanceToPlain(request))
            .pipe(
                map(() => true))

        return this.apiService.sendRequest(obs$)
    }

    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>> {
        const url = `${InspectionsEndpoints.PATH}/${inspectionId}`
        const obs$ = this.http
            .get<InspectionDetailsModel>(url)
            .pipe(
                map(response =>
                    plainToInstance(InspectionDetailsModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    getAllInspections(): Promise<Either<Error, InspectionResponseModel[]>> {
        const url = InspectionsEndpoints.PATH;
        const obs$ = this.http.get<InspectionResponseModel[]>(url).pipe(map((response) => response.map((json) => plainToInstance(InspectionResponseModel, json))));

        return this.apiService.sendRequest(obs$);
    }
}
