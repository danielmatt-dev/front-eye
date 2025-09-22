import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { DoctorIdRequestModel } from '../../data/models/doctor.id.request.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para eliminar uno o varios doctores.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, donde:
 * - **Input:** Arreglo de `number` con los IDs de los doctores.
 * - **Output:** `boolean` indicando si la operación fue exitosa.
 *
 * Convierte los IDs numéricos a una lista de {@link DoctorIdRequestModel}
 * antes de delegar la operación al datasource remoto
 * {@link DoctorDatasourceRemoteImpl.deleteDoctors}.
 */
export class DeleteDoctors implements UseCase<boolean, number[]> {
    /**
     * Constructor del caso de uso.
     *
     * @param remote Implementación del datasource remoto de doctores.
     */
    constructor(private readonly remote: DoctorDatasourceRemoteImpl) { }

    /**
   * Ejecuta el caso de uso para eliminar doctores.
   *
   * @param params Lista de IDs de doctores a eliminar.
   * @returns Una promesa que resuelve en un `Either`:
   * - `Right<boolean>` → `true` si la operación fue exitosa.
   * - `Left<Error>` si ocurre un error.
   *
   * @example
   * ```ts
   * const result = await deleteDoctors.call([1, 2, 3]);
   *
   * if (result._tag === 'Right' && result.right) {
   *   console.log("Doctores eliminados correctamente");
   * } else {
   *   console.error("Error al eliminar doctores:", result.left);
   * }
   * ```
   */
    call(params: number[]): Promise<Either<Error, boolean>> {
        const doctorIds = params.map(id => new DoctorIdRequestModel({ doctorId: id }))
        return this.remote.deleteDoctors(doctorIds)
    }

}
