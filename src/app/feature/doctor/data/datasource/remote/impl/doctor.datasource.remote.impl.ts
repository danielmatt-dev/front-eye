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
import { DoctorIdRequestModel } from '../../../models/doctor.id.request.model';

// <>
@Injectable({ providedIn: 'root' })
/**
 * Implementación remota del datasource de doctores.
 *
 * @description
 * Gestiona la comunicación HTTP con el backend para crear, actualizar,
 * listar y eliminar doctores usando los endpoints definidos en
 * {@link DoctorEndpoints}.  
 * Utiliza `ApiService` para estandarizar el manejo de respuestas/errores
 * dentro de `Either`.
 *
 * Implementa {@link DoctorDatasourceRemote}.
 */
export class DoctorDatasourceRemoteImpl implements DoctorDatasourceRemote {
    /**
   * @param http Cliente HTTP de Angular para realizar solicitudes.
   * @param apiService Servicio común para enviar requests y mapear errores.
   */
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) { }
    /**
 * Crea un nuevo doctor.
 *
 * @param request Datos del doctor a crear.
 * @returns `Promise<Either<Error, DoctorResponseModel>>`
 *
 * @example
 * ```ts
 * datasource.postDoctor(new DoctorRequestModel({...})).then(e =>
 *   e._tag === 'Right' ? console.log(e.right) : console.error(e.left)
 * );
 * ```
 */
    postDoctor(request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>> {
        const url = DoctorEndpoints.PATH
        const obs$ = this.http
            .post<DoctorResponseModel>(url, instanceToPlain(request))
            .pipe(
                map(response =>
                    plainToInstance(DoctorResponseModel, response)))

        return this.apiService.sendRequest<DoctorResponseModel>(obs$)
    }

    /**
   * Actualiza un doctor existente.
   *
   * @param doctorId Identificador del doctor a actualizar.
   * @param request Datos a actualizar.
   * @returns `Promise<Either<Error, DoctorResponseModel>>`
   */
    putDoctor(doctorId: number, request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>> {
        const url = `${DoctorEndpoints.PATH}/${doctorId}`
        const obs$ = this.http
            .put<DoctorResponseModel>(url, instanceToPlain(request))
            .pipe(
                map(response =>
                    plainToInstance(DoctorResponseModel, response)))

        return this.apiService.sendRequest<DoctorResponseModel>(obs$)
    }

    /**
       * Obtiene la lista de doctores.
       *
       * @returns `Promise<Either<Error, DoctorResponseModel[]>>`
       *
       * @example
       * ```ts
       * datasource.getAllDoctors().then(e => {
       *   if (e._tag === 'Right') console.table(e.right);
       * });
       * ```
       */
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

    /**
 * Elimina doctores por lote.
 *
 * @param doctorIds Arreglo de identificadores ({@link DoctorIdRequestModel}) a eliminar.
 * @returns `Promise<Either<Error, boolean>>` → `true` si la operación fue exitosa.
 *
 * @example
 * ```ts
 * datasource.deleteDoctors([{ doctorId: 1 }, { doctorId: 2 }]).then(e => {
 *   if (e._tag === 'Right' && e.right) console.log('Eliminados');
 * });
 * ```
 */
    deleteDoctors(doctorIds: DoctorIdRequestModel[]): Promise<Either<Error, boolean>> {
        const url = DoctorEndpoints.PATH
        const body = instanceToPlain(doctorIds)
        const obs$ = this.http
            .delete(url, { body })
            .pipe(
                map(() => true))

        return this.apiService.sendRequest<boolean>(obs$)
    }

}
