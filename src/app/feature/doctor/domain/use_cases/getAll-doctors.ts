import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para obtener la lista de todos los doctores registrados.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, donde:
 * - **Input:** {@link NoParams} (no requiere parámetros).
 * - **Output:** Arreglo de {@link DoctorResponseModel} con la información de los doctores.
 *
 * Delegada la petición al datasource remoto
 * {@link DoctorDatasourceRemoteImpl.getAllDoctors}.
 */
export class GetAllDoctors implements UseCase<DoctorResponseModel[], NoParams> {
  /**
   * Constructor del caso de uso.
   *
   * @param remote Implementación del datasource remoto de doctores.
   */
    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    /**
   * Ejecuta el caso de uso para obtener la lista de doctores.
   *
   * @param _ Parámetro vacío de tipo {@link NoParams}.
   * @returns Una promesa que resuelve en un `Either`:
   * - `Right<DoctorResponseModel[]>` si la operación es exitosa.
   * - `Left<Error>` si ocurre un error.
   *
   * @example
   * ```ts
   * const result = await getAllDoctors.call({});
   *
   * if (result._tag === 'Right') {
   *   console.table(result.right); // Lista de doctores
   * } else {
   *   console.error("Error al obtener doctores:", result.left);
   * }
   * ```
   */
    async call(_: NoParams): Promise<Either<Error, DoctorResponseModel[]>> {
        return await this.remote.getAllDoctors()
    }

}