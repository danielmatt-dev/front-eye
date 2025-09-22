import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { ClinicDatasourceRemoteImpl } from '../../data/datasource/remote/impl/clinic.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { ClinicModel } from '../../data/models/clinic.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para obtener todas las clínicas registradas.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, sin parámetros de entrada
 * ({@link NoParams}) y retornando un `Either` que contiene:
 * - Una lista de {@link ClinicModel} en caso de éxito.
 * - Un {@link Error} en caso de fallo en la operación.
 *
 * Este caso de uso delega la petición al datasource remoto
 * {@link ClinicDatasourceRemoteImpl}.
 */
export class GetAllClinics implements UseCase<ClinicModel[], NoParams> {
    /**
 * Constructor del caso de uso.
 *
 * @param remote Implementación del datasource remoto de clínicas.
 */
    constructor(private readonly remote: ClinicDatasourceRemoteImpl) { }

    /**
   * Ejecuta el caso de uso para obtener todas las clínicas.
   *
   * @param _ Parámetro vacío de tipo {@link NoParams}.
   * @returns Una promesa que resuelve en un `Either`:
   * - `Right<ClinicModel[]>` si la operación es exitosa.
   * - `Left<Error>` si ocurre un error.
   *
   * @example
   * ```ts
   * this.getAllClinics.call({}).then(result => {
   *   if (result._tag === 'Right') {
   *     console.log("Clínicas:", result.right);
   *   } else {
   *     console.error("Error:", result.left);
   *   }
   * });
   * ```
   */
    async call(_: NoParams): Promise<Either<Error, ClinicModel[]>> {
        return await this.remote.getAllClinics()
    }

}
