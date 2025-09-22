import { InspectionResponseModel } from './inspection.response.model';
import { Type } from 'class-transformer';
import { DiseaseModel } from '../../../disease/data/model/disease.model';

/**
 * Modelo que representa un contenedor combinado de inspecciones y enfermedades.
 *
 * @description
 * Este modelo se utiliza cuando es necesario obtener la lista de inspecciones
 * junto con el catálogo de enfermedades en una sola petición al backend.
 * 
 * Es útil para:
 * - Mostrar en pantalla los resultados de inspecciones y permitir su filtrado
 *   por enfermedad.
 * - Reducir llamadas a la API consolidando los datos relacionados en una sola respuesta.
 */
export class InspectionsWithDiseasesModel {

    /**
   * Lista de inspecciones recuperadas desde el backend.
   */
    @Type(() => InspectionResponseModel)
    inspections: InspectionResponseModel[] = []

    /**
   * Catálogo de enfermedades relacionadas con las inspecciones.
   *
   * @example
   * ```json
   * [
   *   { "diseaseId": 1, "name": "Diabetic Retinopathy" },
   *   { "diseaseId": 2, "name": "AMD" }
   * ]
   * ```
   */
    @Type(() => DiseaseModel)
    diseases: DiseaseModel[] = []

    /**
   * Constructor para inicializar el modelo con datos parciales.
   *
   * @param partial Objeto opcional para inicializar propiedades.
   */
    constructor(partial?: Partial<InspectionsWithDiseasesModel>) {
        Object.assign(this, partial)
    }

}
