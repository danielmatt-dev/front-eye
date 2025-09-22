import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { AimodelDatasourceRemoteImpl } from '../../data/datasource/impl/aimodel.datasource.remote.impl';
import { AiModelModel } from '../../data/model/aimodel.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para obtener todos los modelos de IA.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, retornando una lista de
 * instancias de {@link AiModelModel} sin requerir parámetros de entrada
 * (usa {@link NoParams}).
 *
 * Encapsula la lógica de acceso a los datos delegando la petición
 * al datasource remoto {@link AimodelDatasourceRemoteImpl}.
 */
export class GetAllModels implements UseCase<AiModelModel[], NoParams> {

    /**
     * Constructor del caso de uso.
     *
     * @param remote Implementación del datasource remoto encargada de obtener los modelos de IA.
     */
    constructor(
        private readonly remote: AimodelDatasourceRemoteImpl
    ) { }

    /**
    * Ejecuta el caso de uso para obtener todos los modelos de IA.
    *
    * @param _ Parámetro vacío de tipo {@link NoParams}, requerido por la interfaz `UseCase`.
    * @returns Una promesa que contiene un `Either`:
    * - `Right<AiModelModel[]>` con la lista de modelos en caso de éxito.
    * - `Left<Error>` si ocurre un error durante la operación.
    *
    * @example
    * ```ts
    * this.getAllModels.call({}).then(result => {
    *   if (result._tag === 'Right') {
    *     console.log('Modelos:', result.right);
    *   } else {
    *     console.error('Error:', result.left);
    *   }
    * });
    * ```
    */
    call(_: NoParams): Promise<Either<Error, AiModelModel[]>> {
        return this.remote.getAllModels()
    }

}
