import { Either } from 'fp-ts/lib/Either';
import { ClinicModel } from '../../../models/clinic.model';
import { ClinicDatasourceRemote } from '../clinic.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { ClinicEndpoints } from '../clinic.endpoints';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

/**
 * Implementación remota del datasource de clínicas.
 *
 * @description
 * Se encarga de comunicarse con el backend para obtener información
 * relacionada con las clínicas.  
 * Utiliza `HttpClient` para realizar las peticiones HTTP y
 * `ApiService` para manejar la respuesta de manera uniforme
 * con `Either`.
 */
@Injectable({ providedIn: 'root' })
export class ClinicDatasourceRemoteImpl implements ClinicDatasourceRemote {
    /**
       * Constructor del datasource remoto de clínicas.
       *
       * @param http Cliente HTTP de Angular para realizar solicitudes.
       * @param apiService Servicio genérico para manejar observables y errores.
       */
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) { }

    /**
       * Obtiene todas las clínicas registradas en el sistema.
       *
       * @returns Una promesa que resuelve un `Either`:
       * - `Right<ClinicModel[]>` si la respuesta es exitosa.
       * - `Left<Error>` si ocurre un error durante la solicitud.
       *
       * @example
       * ```ts
       * this.clinicDatasource.getAllClinics().then(result => {
       *   if (result._tag === 'Right') {
       *     console.log("Clínicas:", result.right);
       *   }
       * });
       * ```
       */
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
