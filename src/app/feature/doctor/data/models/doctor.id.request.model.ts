import { Expose } from 'class-transformer';

/**
 * Modelo de solicitud para eliminar doctores.
 *
 * @description
 * Representa el identificador de un doctor que se desea eliminar.
 * Usado principalmente en operaciones de eliminación por lote
 * en {@link DoctorDatasourceRemoteImpl.deleteDoctors}.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear la propiedad `doctor_id`
 * del JSON a la propiedad `doctorId`.
 */
export class DoctorIdRequestModel {
    /**
     * Identificador único del doctor.
     *
     * @example 101
     */
    @Expose({ name: 'doctor_id' })
    doctorId: number = 0

    /**
  * Constructor que permite inicializar el modelo
  * con un objeto parcial de sus propiedades.
  *
  * @param partial Objeto con propiedades opcionales para inicializar la instancia.
  *
  * @example
  * ```ts
  * const idModel = new DoctorIdRequestModel({ doctorId: 101 });
  * ```
  */
    constructor(partial?: Partial<DoctorIdRequestModel>) {
        Object.assign(this, partial)
    }

}
