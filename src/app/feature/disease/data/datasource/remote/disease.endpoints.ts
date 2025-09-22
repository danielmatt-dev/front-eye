/**
 * Definición de endpoints relacionados con enfermedades.
 *
 * @description
 * Centraliza las rutas de la API para operaciones sobre enfermedades,
 * evitando hardcodear strings en el código y facilitando su mantenimiento.
 *
 * @example
 * ```ts
 * const url = DiseaseEndpoints.PATH;
 * this.http.get(url).subscribe(...);
 * ```
 */
export class DiseaseEndpoints {
    /**
     * Endpoint base para operaciones de enfermedades.
     *
     * @example "http://localhost:8080/api/disease"
     */
    static readonly PATH = 'disease'

}
