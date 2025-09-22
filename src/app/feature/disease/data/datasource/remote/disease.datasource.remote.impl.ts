import { Either } from 'fp-ts/lib/Either';
import { DiseaseModel } from '../../model/disease.model';
import { DiseaseDatasourceRemote } from '../disease.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../shared/services/api.service';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { DiseaseEndpoints } from './disease.endpoints';

/**
 * Implementación remota del datasource de enfermedades.
 *
 * @description
 * Se encarga de comunicarse con el backend para obtener información
 * de las enfermedades disponibles.  
 * Utiliza `HttpClient` para realizar la petición y `ApiService`
 * para manejar errores y respuestas dentro de un `Either`.
 */

@Injectable({ providedIn: 'root' })
export class DiseaseDatasourceRemoteImpl implements DiseaseDatasourceRemote {

    /**
   * Constructor del datasource remoto de enfermedades.
   *
   * @param http Cliente HTTP de Angular para realizar solicitudes.
   * @param apiService Servicio genérico para manejar observables y errores.
   */
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) { }

    /**
   * Obtiene todas las enfermedades registradas en el sistema.
   *
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<DiseaseModel[]>` con la lista de enfermedades en caso de éxito.
   * - `Left<Error>` si ocurre un error durante la solicitud.
   *
   * @example
   * ```ts
   * this.diseaseDatasource.getAllDiseases().then(result => {
   *   if (result._tag === 'Right') {
   *     console.log("Enfermedades:", result.right);
   *   } else {
   *     console.error("Error:", result.left);
   *   }
   * });
   * ```
   */

    getAllDiseases(): Promise<Either<Error, DiseaseModel[]>> {
        const url = DiseaseEndpoints.PATH

        const obs$ = this.http
            .get<DiseaseModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(DiseaseModel, json)))
            )

        return this.apiService.sendRequest(obs$)
    }

}
