import { AiModelModel } from '../model/aimodel.model';
import { Either } from 'fp-ts/Either';

/**
 * Contrato para las fuentes de datos remotas de modelos de IA.
 *
 * @description
 * Define la interfaz que deben implementar las clases responsables
 * de comunicarse con servicios externos (por ejemplo, APIs REST)
 * para obtener información sobre los modelos de inteligencia artificial.
 *
 * Implementaciones como {@link AimodelDatasourceRemoteImpl}
 * proporcionan la lógica concreta de acceso a los datos.
 */
export interface AimodelDatasourceRemote {

    /**
      * Obtiene todos los modelos de IA desde una fuente de datos remota.
      *
      * @returns Una promesa que resuelve un `Either`:
      * - `Right<AiModelModel[]>` en caso de éxito con la lista de modelos.
      * - `Left<Error>` si ocurre algún error durante la operación.
      *
      * @example
      * ```ts
      * datasource.getAllModels().then(result => {
      *   if (result._tag === 'Right') {
      *     console.log('Modelos:', result.right);
      *   } else {
      *     console.error('Error:', result.left);
      *   }
      * });
      * ```
      */
    getAllModels(): Promise<Either<Error, AiModelModel[]>>
}
