import { Either } from 'fp-ts/Either';
import { ClinicModel } from '../../models/clinic.model';

/**
 * Contrato para las fuentes de datos remotas de clínicas.
 *
 * @description
 * Define los métodos que deben implementar las clases responsables
 * de comunicarse con el backend para obtener información sobre
 * clínicas.
 *
 * Implementaciones como {@link ClinicDatasourceRemoteImpl}
 * contienen la lógica concreta de comunicación con los endpoints.
 */
export interface ClinicDatasourceRemote {
  /**
   * Obtiene todas las clínicas disponibles en el sistema.
   *
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<ClinicModel[]>` con la lista de clínicas en caso de éxito.
   * - `Left<Error>` si ocurre un error durante la petición.
   *
   * @example
   * ```ts
   * datasource.getAllClinics().then(result => {
   *   if (result._tag === 'Right') {
   *     console.log(result.right); // Lista de clínicas
   *   } else {
   *     console.error(result.left); // Error
   *   }
   * });
   * ```
   */
    getAllClinics(): Promise<Either<Error, ClinicModel[]>>
}
