import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { InspectionDetailsModel } from '../../data/models/inspection.details.model';

/**
 * Caso de uso para obtener el detalle de una inspección por su identificador.
 *
 * @description
 * Esta clase pertenece a la capa de **domain/use_cases** en la arquitectura limpia.
 * Se encarga de solicitar al datasource remoto el detalle completo de una inspección,
 * incluyendo la información del paciente y el historial de inspecciones relacionadas.
 *
 * Retorna un `Either` que encapsula el éxito (`InspectionDetailsModel`) o el fallo (`Error`).
 */
@Injectable({ providedIn: 'root' })
export class GetInspectionById implements UseCase<InspectionDetailsModel, number> {

    constructor(        
    /**
     * Datasource remoto que implementa las operaciones HTTP para inspecciones.
     */
    private readonly remote: InspectionsDatasourceRemoteImpl) { }

    /**
* Ejecuta el caso de uso para recuperar el detalle de una inspección específica.
*
* @param params `number` - Identificador único de la inspección que se desea consultar.
*
* @returns `Promise<Either<Error, InspectionDetailsModel>>` que resuelve con:
* - `Right(InspectionDetailsModel)` si la inspección fue encontrada y retornada exitosamente.
* - `Left(Error)` si ocurre un fallo en la petición remota o no existe la inspección.
*/
    call(params: number): Promise<Either<Error, InspectionDetailsModel>> {
        // Llamada al datasource remoto para obtener los detalles de la inspección solicitada
        return this.remote.getInspectionByInspectionId(params)
    }

}
