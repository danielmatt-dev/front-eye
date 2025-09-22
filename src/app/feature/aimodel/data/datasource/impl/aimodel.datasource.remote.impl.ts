import { AiModelModel } from '../../model/aimodel.model';
import { AimodelDatasourceRemote } from '../aimodel.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../shared/services/api.service';
import { AimodelEndpoints } from './aimodel.endpoints';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { Either } from 'fp-ts/Either';

@Injectable({ providedIn: 'root' })
/**
 * Implementación remota del datasource de modelos de IA.
 *
 * @description
 * Esta clase se encarga de comunicarse con el servicio remoto para
 * obtener información sobre los modelos de IA disponibles.  
 * Utiliza `HttpClient` para realizar las peticiones HTTP y `ApiService`
 * para manejar las respuestas en un formato consistente.
 *
 * Implementa la interfaz {@link AimodelDatasourceRemote}.
 */
export class AimodelDatasourceRemoteImpl implements AimodelDatasourceRemote {

    /**
   * Constructor del datasource remoto.
   *
   * @param http Cliente HTTP de Angular para realizar solicitudes al backend.
   * @param apiService Servicio común para enviar solicitudes y manejar respuestas.
   */
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) { }

    /**
   * Obtiene todos los modelos de IA desde el backend.
   *
   * @description
   * Realiza una petición GET al endpoint definido en
   * {@link AimodelEndpoints.PATH}, transforma las respuestas JSON en
   * instancias de {@link AiModelModel}, y retorna el resultado
   * envuelto en un `Promise<Either<Error, AiModelModel[]>>`.
   *
   * @returns Una promesa que contiene:
   * - `Right<AiModelModel[]>` si la petición fue exitosa.
   * - `Left<Error>` en caso de error.
   *
   * @example
   * ```ts
   * this.datasource.getAllModels().then(result => {
   *   if (result._tag === 'Right') {
   *     console.log(result.right); // Lista de modelos
   *   } else {
   *     console.error(result.left); // Error
   *   }
   * });
   * ```
   */
    getAllModels(): Promise<Either<Error, AiModelModel[]>> {

        const url = AimodelEndpoints.PATH

        const obs$ = this.http
            .get<AiModelModel[]>(url)
            .pipe(
                map(response =>
                    response.map(json =>
                        plainToInstance(AiModelModel, json)))
            )

        return this.apiService.sendRequest(obs$)
    }

}
