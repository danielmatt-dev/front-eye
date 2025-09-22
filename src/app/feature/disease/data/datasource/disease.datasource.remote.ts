import { Either } from 'fp-ts/Either';
import { DiseaseModel } from '../model/disease.model';

/**
 * Contrato para las fuentes de datos remotas de enfermedades.
 *
 * @description
 * Define los métodos que deben implementar las clases responsables
 * de comunicarse con el backend para obtener información de enfermedades.
 *
 * Implementaciones como {@link DiseaseDatasourceRemoteImpl}
 * contienen la lógica concreta de comunicación con los endpoints.
 */
export interface DiseaseDatasourceRemote {
  /**
   * Obtiene todas las enfermedades disponibles en el sistema.
   *
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<DiseaseModel[]>` con la lista de enfermedades en caso de éxito.
   * - `Left<Error>` si ocurre un error durante la petición.
   *
   * @example
   * ```ts
   * datasource.getAllDiseases().then(result => {
   *   if (result._tag === 'Right') {
   *     console.log(result.right); // Lista de enfermedades
   *   } else {
   *     console.error(result.left); // Error
   *   }
   * });
   * ```
   */
    getAllDiseases(): Promise<Either<Error, DiseaseModel[]>>

}
