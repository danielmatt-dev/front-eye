import { Either } from 'fp-ts/lib/Either';
import { NoParams, UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { InspectionsDatasourceRemoteImpl } from '../../data/datasource/remote/impl/inspections.datasource.remote.impl';
import { InspectionsWithDiseasesModel } from '../../data/models/inspections-with-diseases.model';

/**
 * Caso de uso para obtener todas las inspecciones.
 *
 * @description
 * Esta clase forma parte de la capa de **domain/use_cases** en la arquitectura limpia.
 * Se encarga de orquestar la recuperación de todas las inspecciones desde el datasource remoto,
 * incluyendo el catálogo de enfermedades asociado.
 *
 * Retorna un `Either` que encapsula el éxito (`InspectionsWithDiseasesModel`) o el fallo (`Error`).
 */
@Injectable({ providedIn: 'root' })
export class GetAllInspections implements UseCase<InspectionsWithDiseasesModel, NoParams> {

    constructor(        
    /**
     * Datasource remoto que implementa las llamadas HTTP relacionadas con inspecciones.
     */
    private readonly remote: InspectionsDatasourceRemoteImpl) { }

    /**
     * Ejecuta el caso de uso para obtener todas las inspecciones registradas.
     *
     * @param _ `NoParams` - Este caso de uso no requiere parámetros de entrada.
     *
     * @returns `Promise<Either<Error, InspectionsWithDiseasesModel>>` que resuelve con:
     * - `Right(InspectionsWithDiseasesModel)` si la petición es exitosa e incluye inspecciones y enfermedades.
     * - `Left(Error)` si ocurre un error durante la llamada remota.
     */
    async call(_: NoParams): Promise<Either<Error, InspectionsWithDiseasesModel>> {
        // Llamada al datasource remoto para recuperar inspecciones y su catálogo de enfermedades
        return this.remote.getAllInspections()
    }

}
