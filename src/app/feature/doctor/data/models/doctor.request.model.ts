import { Expose, Type } from 'class-transformer';

/**
 * Modelo de solicitud para crear o actualizar un doctor.
 *
 * @description
 * Contiene la información necesaria para registrar o modificar
 * un doctor en el sistema, incluyendo datos personales,
 * de contacto y de ubicación.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear nombres de propiedades
 * de la API a nombres de propiedades de TypeScript.
 */
export class DoctorRequestModel {
    /**
     * Identificador de la clínica a la que pertenece el doctor.
     *
     * @example 5
     */
    @Expose({ name: 'clinic_id' })
    clinicId?: number

    /**
   * Nombre del doctor.
   *
   * @example "Juan"
   */
    @Expose({ name: 'first_name' })
    firstName: string = ''

    /**
   * Apellido paterno del doctor.
   *
   * @example "Pérez"
   */
    @Expose({ name: 'last_fath_name' })
    lastFathName: string = ''

    /**
   * Apellido materno del doctor.
   *
   * @example "Ramírez"
   */
    @Expose({ name: 'last_mont_name' })
    lastMontName: string = ''

    /**
   * Fecha de nacimiento del doctor.
   *
   * @example new Date("1985-07-15")
   */
    @Expose({ name: 'birth_date' })
    @Type(() => Date)
    birthDate: Date = new Date()

    /**
   * Género del doctor.
   *
   * @example "male"
   * @example "female"
   */
    gender: string = ''

    /**
   * Dirección de residencia del doctor.
   *
   * @example "Av. Reforma #123, Ciudad de México"
   */
    address: string = ''

    /**
   * Estado o provincia de residencia.
   *
   * @example "CDMX"
   */
    state: string = ''

    /**
   * Código postal de la dirección del doctor.
   *
   * @example "01234"
   */
    @Expose({ name: 'postal_code' })
    postalCode: string = ''

    /**
   * Correo electrónico de contacto.
   *
   * @example "juan.perez@clinica.com"
   */
    email: string = ''

    /**
   * Constructor que permite inicializar el modelo
   * con un objeto parcial de sus propiedades.
   *
   * @param partial Objeto con propiedades opcionales para inicializar la instancia.
   *
   * @example
   * ```ts
   * const request = new DoctorRequestModel({
   *   firstName: "Juan",
   *   lastFathName: "Pérez",
   *   email: "juan.perez@clinica.com"
   * });
   * ```
   */
    constructor(partial?: Partial<DoctorRequestModel>) {
        Object.assign(this, partial)
    }

}
