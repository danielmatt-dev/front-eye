import { Either } from 'fp-ts/lib/Either';
import { InspectionDatasourceRemote } from '../inspection.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { InspectionsEndpoints } from '../inspections.endpoints';
import { map } from 'rxjs/operators';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InspectionDetailsModel } from '../../../models/inspection.details.model';
import { InspectionRequestModel } from '../../../models/inspection.request.model';
import { NewInspectionDataModel } from '../../../models/new.inspection.data.model';
import { InspectionsWithDiseasesModel } from '../../../models/inspections-with-diseases.model';
import { InspectionResponseModel } from '../../../models/inspection.response.model';

// <>
@Injectable({ providedIn: 'root' })
/**
 * Implementación remota del datasource de inspecciones.
 *
 * @description
 * Gestiona la comunicación HTTP con el backend para crear inspecciones,
 * obtener detalles, listar todas y recuperar la data necesaria para
 * iniciar una nueva inspección.  
 * Utiliza {@link ApiService} para estandarizar el manejo de respuestas
 * y errores, devolviendo resultados en un `Either`.
 *
 * Implementa {@link InspectionDatasourceRemote}.
 */
export class InspectionsDatasourceRemoteImpl implements InspectionDatasourceRemote {
    /**
     * @param http Cliente HTTP de Angular para realizar solicitudes.
     * @param apiService Servicio común para enviar requests y mapear errores.
     */
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) { }

    /**
     * Crea una nueva inspección.
     *
     * @param request Datos necesarios para crear la inspección.
     * @returns `Promise<Either<Error, InspectionResponseModel>>`
     *
     * @example
     * ```ts
     * const req = new InspectionRequestModel({...});
     * const res = await datasource.postInspection(req);
     * if (res._tag === 'Right') console.log(res.right.inspectionId);
     * ```
     */
    postInspection(request: InspectionRequestModel): Promise<Either<Error, InspectionResponseModel>> {
        const url = InspectionsEndpoints.PATH;
        const obs$ = this.http
            .post<InspectionResponseModel>(url, instanceToPlain(request))
            .pipe(map((response) => plainToInstance(InspectionResponseModel, response)));

        return this.apiService.sendRequest(obs$);
    }

    /**
     * Obtiene el detalle completo de una inspección por su ID.
     *
     * @param inspectionId Identificador de la inspección.
     * @returns `Promise<Either<Error, InspectionDetailsModel>>`
     */
    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>> {
        const url = `${InspectionsEndpoints.PATH}/${inspectionId}`;
        const obs$ = this.http.get<InspectionDetailsModel>(url).pipe(map((response) => plainToInstance(InspectionDetailsModel, response)));

        return this.apiService.sendRequest(obs$);
    }

    /**
   * Obtiene todas las inspecciones, incluyendo su relación con enfermedades.
   *
   * @returns `Promise<Either<Error, InspectionsWithDiseasesModel>>`
   *
   * @example
   * ```ts
   * const res = await datasource.getAllInspections();
   * if (res._tag === 'Right') {
   *   console.log(res.right.inspections.length);
   * }
   * ```
   */
    getAllInspections(): Promise<Either<Error, InspectionsWithDiseasesModel>> {
        const url = InspectionsEndpoints.PATH;
        const obs$ = this.http
            .get<InspectionsWithDiseasesModel>(url)
            .pipe(
                map(response => plainToInstance(InspectionsWithDiseasesModel, response)));

        return this.apiService.sendRequest(obs$);
    }

    /**
 * Recupera la data necesaria para iniciar una nueva inspección
 * (catálogos, opciones por defecto, etc.).
 *
 * @returns `Promise<Either<Error, NewInspectionDataModel>>`
 */
    getDataNewInspection(): Promise<Either<Error, NewInspectionDataModel>> {
        const url = InspectionsEndpoints.PATH_DATA;

        const obs$ = this.http
            .get<NewInspectionDataModel>(url)
            .pipe(
                map(response => plainToInstance(NewInspectionDataModel, response)))

        return this.apiService.sendRequest(obs$);
    }

}
