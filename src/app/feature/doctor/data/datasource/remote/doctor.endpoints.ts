import { BASE_URL } from '../../../../../shared/utils/base.url';

/**
 * Definición de endpoints relacionados con doctores.
 *
 * @description
 * Centraliza la ruta base de la API para operaciones de doctores,
 * evitando el uso de strings hardcodeados en el código y facilitando
 * su mantenimiento.
 *
 * @example
 * ```ts
 * const url = DoctorEndpoints.PATH;
 * this.http.get(url).subscribe(...);
 * ```
 */
export class DoctorEndpoints {
    /**
   * Endpoint base para operaciones de doctores.
   *
   * @example "http://localhost:8080/api/doctor"
   */
    static readonly PATH = `${BASE_URL}/doctor`
}
