import { Expose, Type } from 'class-transformer';
import { DiagnosticProbabilityModel } from './inspection.request.model';
import { InspectionImageModel } from './inspection.details.model';
import { OptionLabel } from '../../../../shared/utils/data';

/**
 * Modelo que representa la respuesta de una inspección.
 *
 * @description
 * Contiene toda la información resultante de una inspección: datos del paciente,
 * detalles del diagnóstico, probabilidades de cada categoría, imágenes asociadas
 * y metadatos como fecha, hora y doctor que realizó la inspección.
 */

export class InspectionResponseModel {

    /**
   * Identificador único de la inspección.
   *
   * @example 101
   */
    @Expose({ name: 'inspection_id' })
    inspectionId: number = 0

    /**
   * Identificador del paciente asociado a la inspección.
   *
   * @example 1205
   */
    @Expose({ name: 'patient_id' })
    patientId: number = 0

    /**
  * Fecha de nacimiento del paciente.
  */
    @Expose({ name: 'patient_birth_date' })
    @Type(() => Date)
    patientBirthDate: Date = new Date()

    /**
     * Género del paciente (por ejemplo "male", "female").
     */
    @Expose({ name: 'patient_gender' })
    patientGender: string = ''

    /**
   * Edad del paciente en el momento de la inspección.
   *
   * @example 56
   */
    @Expose({ name: 'patient_age' })
    patientAge: number = 0

    /**
   * Fecha en que se realizó la inspección.
   */
    @Expose({ name: 'inspection_date' })
    @Type(() => Date)
    inspectionDate: Date = new Date()

    /**
   * Hora de la inspección en formato HH:mm:ss.
   *
   * @example "10:45:32"
   */
    @Expose({ name: 'inspection_time' })
    inspectionTime: string = ''

    /**
   * Nombre del doctor que realizó la inspección.
   */
    doctor: string = ''

    /**
   * Ojo inspeccionado (por ejemplo "left", "right").
   */
    eye: string = ''

    /**
   * Representación traducida o formateada del ojo inspeccionado para UI.
   */
    eyeOption: OptionLabel | undefined;

    /**
   * Identificador de la enfermedad detectada.
   */
    @Expose({ name: 'disease_id' })
    diseaseId: number = 0;

    /**
   * Nombre de la enfermedad detectada.
   *
   * @example "Diabetic Retinopathy"
   */
    disease: string = ''

    /**
   * Representación traducida o formateada de la enfermedad para UI.
   */
    diseaseOption: OptionLabel | undefined;

    /**
   * Modelo de IA utilizado para el diagnóstico.
   *
   * @example "RetinaNet v1.2"
   */
    model: string = ''

    /**
   * Resultado principal de la inspección.
   *
   * @example "Moderate"
   */
    result: string = ''

    /**
 * Representación traducida o formateada del resultado para UI.
 */
    resultOption: OptionLabel | undefined;

    /**
  * Notas clínicas adicionales agregadas por el médico.
  */
    notes: string = ''

    /**
     * Lista de probabilidades por categoría de resultado.
     *
     * @example
     * ```json
     * [
     *   { "resultCategory": "Moderate", "probability": 0.72 },
     *   { "resultCategory": "Proliferative", "probability": 0.18 }
     * ]
     * ```
     */
    @Expose({ name: 'diagnostic_probabilities' })
    @Type(() => DiagnosticProbabilityModel)
    diagnosticProbabilities: DiagnosticProbabilityModel[] = []

    /**
   * Imágenes asociadas a la inspección (por ejemplo, fondo de ojo).
   */
    @Expose({ name: 'inspection_images' })
    @Type(() => InspectionImageModel)
    inspectionImages: InspectionImageModel[] = []

    /**
   * Constructor que permite inicializar el modelo con un objeto parcial.
   */
    constructor(partial?: Partial<InspectionResponseModel>) {
        Object.assign(this, partial)
    }

    /**
 * Obtiene un objeto `Date` combinando la fecha y la hora de la inspección.
 * 
 * @description
 * Esta propiedad es útil para ordenar inspecciones cronológicamente o mostrar
 * fecha y hora en un único timestamp.
 *
 * @returns `Date` con la fecha y hora combinadas.
 */
    get inspectionDateTime(): Date {
        // Copiamos la fecha para no mutar inspectionDate original
        const dt = new Date(this.inspectionDate);
        if (this.inspectionTime) {
            const [h, m, s] = this.inspectionTime
                .split(':')
                .map(part => parseInt(part, 10));
            dt.setHours(h, m, s);
        }
        return dt;
    }

}
