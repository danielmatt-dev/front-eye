import { BASE_URL } from '../../../../../shared/utils/base.url';

/**
 * Definición de endpoints relacionados con clínicas.
 *
 * @description
 * Centraliza las rutas de la API para operaciones sobre clínicas,
 * facilitando su mantenimiento y evitando valores hardcodeados
 * en el código.
 *
 * @example
 * ```ts
 * const url = ClinicEndpoints.PATH;
 * this.http.get(url).subscribe(...);
 * ```
 */
export class ClinicEndpoints {
    /**
     * Endpoint base para operaciones de clínicas.
     *
     * @example "http://localhost:8080/api/clinic"
     */
    static PATH = `${BASE_URL}/clinic`
}
