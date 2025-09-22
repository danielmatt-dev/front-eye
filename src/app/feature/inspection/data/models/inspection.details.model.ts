import { InspectionResponseModel } from './inspection.response.model';
import { Expose, Type } from 'class-transformer';
import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';

/**
 * Modelo que representa el detalle completo de una inspección.
 *
 * @description
 * Contiene la información principal de la inspección, el paciente asociado
 * y el historial de inspecciones previas para brindar un contexto clínico completo.
 */
export class InspectionDetailsModel {
    /**
     * Información principal de la inspección.
     */
    @Type(() => InspectionResponseModel)
    inspection: InspectionResponseModel = new InspectionResponseModel()

    /**
     * Datos del paciente al que pertenece la inspección.
     */
    @Type(() => PatientResponseModel)
    patient: PatientResponseModel = new PatientResponseModel()

    /**
 * Historial de inspecciones previas del paciente.
 *
 * @example
 * ```json
 * [
 *   { "inspectionId": 12, "date": "2024-09-20T10:30:00Z", "result": "Normal" },
 *   { "inspectionId": 10, "date": "2024-05-14T15:00:00Z", "result": "Diabetic Retinopathy" }
 * ]
 * ```
 */
    @Expose({ name: 'inspection_history' })
    @Type(() => InspectionResponseModel)
    inspectionHistory: InspectionResponseModel[] = []

    /**
 * Constructor para inicializar el modelo con datos parciales.
 *
 * @param partial Objeto parcial que permite sobreescribir propiedades al inicializar.
 */
    constructor(partial?: Partial<InspectionDetailsModel>) {
        Object.assign(this, partial)
    }

}

/**
 * Modelo que representa una imagen asociada a una inspección.
 *
 * @description
 * Contiene la URL de la imagen y un título descriptivo. Se utiliza para
 * almacenar y mostrar imágenes relacionadas a los resultados de la inspección.
 */
export class InspectionImageModel {

    /**
 * Identificador único de la imagen de inspección.
 *
 * @example 101
 */
    @Expose({ name: 'inspection_image_id' })
    inspectionImageId?: number

    /**
 * URL donde está alojada la imagen.
 *
 * @example "https://example.com/images/inspection_101.png"
 */
    @Expose({ name: 'image_url' })
    imageUrl: string = ''

    /**
     * Título descriptivo de la imagen.
     *
     * @example "Fondo de ojo izquierdo"
     */
    title: string = ''

    /**
 * Constructor para inicializar el modelo con datos parciales.
 *
 * @param partial Objeto parcial para inicializar propiedades opcionales.
 */
    constructor(partial?: Partial<InspectionImageModel>) {
        Object.assign(this, partial)
    }

}
