import { Either } from 'fp-ts/Either';
import { InspectionRequestModel } from '../../models/inspection.request.model';
import { InspectionDetailsModel } from '../../models/inspection.details.model';
import { NewInspectionDataModel } from '../../models/new.inspection.data.model';
import { InspectionsWithDiseasesModel } from '../../models/inspections-with-diseases.model';
import { InspectionResponseModel } from '../../models/inspection.response.model';

/**
 * Contrato para el datasource remoto de inspecciones.
 *
 * @description
 * Define las operaciones que permiten interactuar con la API de inspecciones,
 * incluyendo creación de registros, obtención de detalles, listados y
 * recuperación de datos necesarios para iniciar una nueva inspección.
 *
 * Es implementada por {@link InspectionsDatasourceRemoteImpl}.
 */
export interface InspectionDatasourceRemote {

    /**
    * Crea una nueva inspección en el sistema.
    *
    * @param request Objeto con los datos requeridos para el alta de la inspección.
    * @returns `Promise<Either<Error, InspectionResponseModel>>` con el resultado.
    */
    postInspection(request: InspectionRequestModel): Promise<Either<Error, InspectionResponseModel>>

    /**
     * Recupera todas las inspecciones junto con su relación de enfermedades.
     *
     * @returns `Promise<Either<Error, InspectionsWithDiseasesModel>>`
     * con la colección de inspecciones.
     */
    getAllInspections(): Promise<Either<Error, InspectionsWithDiseasesModel>>

    /**
     * Obtiene el detalle completo de una inspección por su identificador.
     *
     * @param inspectionId Identificador único de la inspección a consultar.
     * @returns `Promise<Either<Error, InspectionDetailsModel>>`
     * con el detalle de la inspección si existe.
     */
    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>>

    /**
     * Recupera la data necesaria para inicializar una nueva inspección,
     * como catálogos y valores por defecto.
     *
     * @returns `Promise<Either<Error, NewInspectionDataModel>>`
     */
    getDataNewInspection(): Promise<Either<Error, NewInspectionDataModel>>

}
