import { Expose, Type } from 'class-transformer';
import { OptionLabel } from '../../../../shared/utils/data';

/**
 * Modelo de respuesta para doctores.
 *
 * @description
 * Representa la información completa de un doctor retornada por el backend,
 * incluyendo datos personales, de contacto, relación con la clínica y
 * metadatos de creación/actualización.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear los nombres de propiedades
 * provenientes del backend a propiedades en TypeScript.
 */
export class DoctorResponseModel {
    /**
     * Identificador único del doctor.
     *
     * @example 101
     */
    @Expose({ name: 'doctor_id' })
    doctorId: number = 0

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
   * Correo electrónico del doctor.
   *
   * @example "juan.perez@clinica.com"
   */
    email: string = ''

    /**
     * Teléfono del doctor.
     *
     * @example "1234567890"
     */
    phone: string = ''

    /**
   * Fecha de nacimiento del doctor.
   *
   * @example new Date("1985-07-15")
   */
    @Expose({ name: 'birth_date' })
    @Type(() => Date)
    birthDate: Date = new Date()

    /**
   * Edad calculada del doctor.
   *
   * @example 39
   */
    age: number = 0

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
   * Código postal.
   *
   * @example "01234"
   */
    @Expose({ name: 'postal_code' })
    postalCode: string = ''

    /**
   * Identificador de la clínica a la que pertenece el doctor.
   *
   * @example 5
   */
    @Expose({ name: 'clinic_id' })
    clinicId: number = 0

    /**
     * Nombre de la clínica.
     *
     * @example "Clínica Oftalmológica Central"
     */
    clinic: string = ''

    /**
   * Descripción de la clínica.
   *
   * @example "Especializada en tratamientos de retina y mácula."
   */
    @Expose({ name: 'clinic_description' })
    clinicDescription: string = ''

    /**
   * Fecha de creación del registro.
   */
    @Expose({ name: 'created_at' })
    @Type(() => Date)
    createdAt: Date = new Date()

    /**
   * Fecha de última actualización del registro.
   */
    @Expose({ name: 'updated_at' })
    @Type(() => Date)
    updatedAt?: Date

    /**
   * Representación del género como opción (usado en UI).
   *
   * @remarks
   * Esta propiedad es opcional y no proviene del backend.
   */
    genderOption: OptionLabel | undefined;

    /**
 * Constructor que permite inicializar el modelo con datos parciales.
 *
 * @param partial Objeto con propiedades opcionales para inicializar la instancia.
 *
 * @example
 * ```ts
 * const doctor = new DoctorResponseModel({
 *   doctorId: 101,
 *   firstName: "Juan",
 *   clinic: "Clínica Central"
 * });
 * ```
 */
    constructor(partial?: Partial<DoctorResponseModel>) {
        Object.assign(this, partial)
    }

}
