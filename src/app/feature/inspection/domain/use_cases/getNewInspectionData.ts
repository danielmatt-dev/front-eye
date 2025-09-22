import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { NewInspectionDataModel } from '../../data/models/new.inspection.data.model';

/**
 * Caso de uso para obtener los datos necesarios para inicializar una nueva inspección.
 *
 * @description
 * Esta clase forma parte de la capa de **domain/use_cases** en la arquitectura limpia.
 * Se encarga de recuperar desde el datasource remoto toda la información requerida
 * para llenar el formulario de creación de inspección: pacientes, enfermedades y modelos de IA disponibles.
 *
 * Retorna un `Either` que encapsula el éxito (`NewInspectionDataModel`) o el fallo (`Error`).
 */
@Injectable({ providedIn: 'root' })
export class GetNewInspectionData implements UseCase<NewInspectionDataModel, NoParams> {

    constructor(
                /**
         * Datasource remoto encargado de proveer los datos de soporte
         * para el inicio de una nueva inspección.
         */
        private readonly remote: InspectionsDatasourceRemoteImpl
    ) {}
    
        /**
     * Ejecuta el caso de uso para recuperar el detalle de una inspección específica.
     *
     * @param params `number` - Identificador único de la inspección que se desea consultar.
     *
     * @returns `Promise<Either<Error, InspectionDetailsModel>>` que resuelve con:
     * - `Right(InspectionDetailsModel)` si la inspección fue encontrada y retornada exitosamente.
     * - `Left(Error)` si ocurre un fallo en la petición remota o no existe la inspección.
     */
    call(_: NoParams): Promise<Either<Error, NewInspectionDataModel>> {
        return this.remote.getDataNewInspection()
    }

}
