import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { InspectionRequestModel } from '../../data/models/inspection.request.model';

/**
 * Caso de uso para crear una inspección.
 *
 * @description
 * Esta clase forma parte de la capa de **domain/use_cases** en la arquitectura limpia.
 * Su responsabilidad es orquestar la creación de una inspección, delegando la
 * llamada al `InspectionsDatasourceRemoteImpl` para comunicarse con el endpoint remoto.
 *
 * Retorna un `Either` que encapsula el éxito (`InspectionResponseModel`) o el fallo (`Error`).
 */
@Injectable({ providedIn: 'root' })
export class CreateInspection implements UseCase<InspectionResponseModel, InspectionRequestModel> {

    constructor(
    /**
     * Datasource remoto que contiene la implementación de las llamadas HTTP
     * relacionadas con inspecciones.
     */
        private readonly remote: InspectionsDatasourceRemoteImpl) { }

    /**
     * Ejecuta el caso de uso para crear una inspección.
     *
     * @param params `InspectionRequestModel` - Datos necesarios para crear la inspección,
     * incluyendo paciente, enfermedad, modelo de IA, imagen y notas.
     *
     * @returns `Promise<Either<Error, InspectionResponseModel>>` que resuelve con:
     * - `Right(InspectionResponseModel)` si la inspección fue creada exitosamente.
     * - `Left(Error)` si ocurre algún fallo en la petición remota.
     */
    async call(params: InspectionRequestModel): Promise<Either<Error, InspectionResponseModel>> {
        // Llamada al datasource remoto que envía la solicitud POST al endpoint de inspecciones
        return await this.remote.postInspection(params)
    }

}
