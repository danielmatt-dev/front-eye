import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';
import { DiseaseModel } from '../../../disease/data/model/disease.model';
import { AiModelModel } from '../../../aimodel/data/model/aimodel.model';
import { Type } from 'class-transformer';

/**
 * Modelo que representa los datos necesarios para inicializar la creación de una nueva inspección.
 *
 * @description
 * Este modelo se utiliza para cargar previamente:
 * - El catálogo de pacientes disponibles.
 * - El catálogo de enfermedades registradas.
 * - Los modelos de IA que pueden ser utilizados para el diagnóstico.
 *
 * Es ideal para poblar formularios o selectores antes de registrar una inspección.
 */
export class NewInspectionDataModel {

    /**
       * Lista de pacientes disponibles para asignar la inspección.
       */
    @Type(() => PatientResponseModel)
    patients: PatientResponseModel[] = []

    /**
     * Lista de enfermedades disponibles para seleccionar durante la inspección.
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
   * Lista de modelos de inteligencia artificial disponibles para el análisis.
   *
   * @example
   * ```json
   * [
   *   { "aiModelId": 10, "name": "RetinaNet", "version": "v1.2.0" },
   *   { "aiModelId": 12, "name": "EfficientNet", "version": "v2.0.1" }
   * ]
   * ```
   */
    @Type(() => AiModelModel)
    models: AiModelModel[] = []

    /**
     * Constructor que permite inicializar el modelo con datos parciales.
     *
     * @param partial Objeto opcional con propiedades a inicializar.
     */
    constructor(partial?: Partial<NewInspectionDataModel>) {
        Object.assign(this, partial)
    }

}
