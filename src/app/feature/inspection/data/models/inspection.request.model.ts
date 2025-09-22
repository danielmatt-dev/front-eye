import { Expose } from 'class-transformer';
import { OptionLabel } from '../../../../shared/utils/data';

/**
 * Modelo de solicitud para crear o registrar una inspección.
 *
 * @description
 * Representa el payload que se envía al backend cuando se crea una nueva inspección.
 * Contiene las referencias al paciente, la enfermedad detectada, el modelo de IA utilizado,
 * así como información adicional como la imagen y notas clínicas.
 */
export class InspectionRequestModel {

    /**
   * Identificador único del paciente al que pertenece la inspección.
   *
   * @example 1205
   */
    @Expose({ name: 'patient_id' })
    patientId: number = 0;

    /**
   * Identificador de la enfermedad detectada o asociada.
   *
   * @example 3
   */
    @Expose({ name: 'disease_id' })
    diseaseId: number = 0;

    /**
   * Identificador del modelo de IA utilizado para el diagnóstico.
   *
   * @example 7
   */
    @Expose({ name: 'model_id' })
    modelId: number = 0;

    /**
     * Imagen asociada a la inspección (puede ser en formato base64).
     *
     * @example "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
     */
    image: string = '';

    /**
 * Ojo examinado en la inspección.
 *
 * @example "left" | "right"
 */
    eye: string = '';

    /**
 * Notas clínicas adicionales proporcionadas por el médico.
 *
 * @example "Presencia de drusas en mácula, se sugiere seguimiento en 6 meses."
 */
    notes: string = '';

    /**
 * Constructor para inicializar el modelo con datos parciales.
 *
 * @param partial Objeto opcional con propiedades a inicializar.
 */
    constructor(partial?: Partial<InspectionRequestModel>) {
        Object.assign(this, partial);
    }
}

/**
 * Modelo que representa la probabilidad de diagnóstico para una inspección.
 *
 * @description
 * Se utiliza para expresar el grado de certeza de una categoría de resultado
 * en el diagnóstico generado por el modelo de IA.
 */
export class DiagnosticProbabilityModel {

    /**
     * Identificador único de la probabilidad de diagnóstico.
     *
     * @example 15
     */
    @Expose({ name: 'diagnostic_probability_id' })
    diagnosticProbabilityId?: number

    /**
 * Categoría de resultado asignada por el modelo.
 *
 * @example "Proliferative Diabetic Retinopathy"
 */
    @Expose({ name: 'result_category' })
    resultCategory: string = ''

    /**
   * Probabilidad de que el diagnóstico pertenezca a esta categoría.
   *
   * @example 0.87 // Representa 87%
   */
    probability: number = 0.0

    /**
 * Opción de resultado traducida o formateada para UI.
 */
    resultOption: OptionLabel | undefined;

    /**
 * Constructor para inicializar el modelo con datos parciales.
 *
 * @param partial Objeto opcional con propiedades a inicializar.
 */
    constructor(partial?: Partial<DiagnosticProbabilityModel>) {
        Object.assign(this, partial)
    }

}
