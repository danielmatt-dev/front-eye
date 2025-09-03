import { Expose } from 'class-transformer';

/**
 * Modelo que representa un registro de un modelo de IA.
 *
 * @description
 * Contiene la información básica de un modelo de inteligencia artificial,
 * incluyendo su identificador, nombre, versión y descripción.
 */
export class AiModelModel {

    /**
     * Identificador único del modelo de IA.
     *
     * @example 101
     */
    @Expose({ name: 'ai_model_id' })
    aiModelId?: number = undefined

    /**
     * Nombre del modelo de IA.
     *
     * @example "RetinaNet"
     */
    name?: string = ''

    /**
     * Versión del modelo de IA.
     *
     * @example "v1.2.0"
     */
    version?: string = ''

    /**
     * Descripción breve del modelo de IA.
     *
     * @example "Modelo entrenado para detección de enfermedades oculares."
     */
    description?: string = ''

    /**
     * Constructor que permite inicializar el modelo
     * con un objeto parcial de sus propiedades.
     *
     * @param partial Objeto con propiedades opcionales para inicializar la instancia.
     */
    constructor(partial?: Partial<AiModelModel>) {
        Object.assign(this, partial)
    }

}
