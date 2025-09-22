import { Expose } from 'class-transformer';

/**
 * Modelo que representa una enfermedad en el sistema.
 *
 * @description
 * Contiene la información básica de una enfermedad, incluyendo
 * su identificador único, nombre y descripción.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear la propiedad `disease_id`
 * del JSON a la propiedad `diseaseId`.
 */
export class DiseaseModel {
    /**
 * Identificador único de la enfermedad.
 *
 * @example 10
 */
    @Expose({ name: 'disease_id' })
    diseaseId?: number = undefined

    /**
 * Nombre de la enfermedad.
 *
 * @example "Retinopatía diabética"
 */
    name: string = ''

    /**
 * Descripción breve de la enfermedad.
 *
 * @example "Complicación ocular causada por la diabetes que puede llevar a la ceguera."
 */
    description: string = ''

    /**
 * Constructor que permite inicializar el modelo
 * con un objeto parcial de sus propiedades.
 *
 * @param partial Objeto con propiedades opcionales para inicializar la instancia.
 *
 * @example
 * ```ts
 * const disease = new DiseaseModel({
 *   diseaseId: 10,
 *   name: "Retinopatía diabética",
 *   description: "Complicación ocular causada por la diabetes que puede llevar a la ceguera."
 * });
 * ```
 */
    constructor(partial?: Partial<DiseaseModel>) {
        Object.assign(this, partial)
    }

}
