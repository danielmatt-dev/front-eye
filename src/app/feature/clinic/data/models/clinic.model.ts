import { Expose } from 'class-transformer';

/**
 * Modelo que representa una clínica en el sistema.
 *
 * @description
 * Contiene la información básica de una clínica, incluyendo
 * su identificador único, nombre y descripción.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear la propiedad `clinic_id`
 * del JSON a la propiedad `clinicId`.
 */
export class ClinicModel {
    /**
   * Identificador único de la clínica.
   *
   * @example 101
   */
    @Expose({ name: 'clinic_id' })
    clinicId: number = 1

    /**
   * Nombre de la clínica.
   *
   * @example "Eye insights"
   */
    name: string = ''

    /**
   * Descripción de la clínica.
   *
   * @example "Especializada en tratamientos de retina y mácula."
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
   * const clinic = new ClinicModel({
   *   clinicId: 101,
   *   name: "Clínica Oftalmológica Central",
   *   description: "Especializada en tratamientos de retina y mácula."
   * });
   * ```
   */
    constructor(partial?: Partial<ClinicModel>) {
        Object.assign(this, partial)
    }

}
