import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { DiseaseDatasourceRemoteImpl } from '../../data/datasource/remote/disease.datasource.remote.impl';
import { DiseaseModel } from '../../data/model/disease.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para obtener todas las enfermedades registradas.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, sin parámetros de entrada
 * ({@link NoParams}) y retornando un `Either` que contiene:
 * - Una lista de {@link DiseaseModel} en caso de éxito.
 * - Un {@link Error} en caso de fallo en la operación.
 *
 * Este caso de uso delega la petición al datasource remoto
 * {@link DiseaseDatasourceRemoteImpl}.
 */
export class GetAllDiseases implements UseCase<DiseaseModel[], NoParams> {
    /**
 * Constructor del caso de uso.
 *
 * @param remote Implementación del datasource remoto de enfermedades.
 */
    constructor(
        private readonly remote: DiseaseDatasourceRemoteImpl
    ) { }

    /**
 * Ejecuta el caso de uso para obtener todas las enfermedades.
 *
 * @param _ Parámetro vacío de tipo {@link NoParams}.
 * @returns Una promesa que resuelve en un `Either`:
 * - `Right<DiseaseModel[]>` si la operación es exitosa.
 * - `Left<Error>` si ocurre un error.
 *
 * @example
 * ```ts
 * this.getAllDiseases.call({}).then(result => {
 *   if (result._tag === 'Right') {
 *     console.log("Enfermedades:", result.right);
 *   } else {
 *     console.error("Error:", result.left);
 *   }
 * });
 * ```
 */
    call(_: NoParams): Promise<Either<Error, DiseaseModel[]>> {
        return this.remote.getAllDiseases()
    }

}
