import { BASE_URL } from '../../../../../shared/utils/base.url';

/**
 * Rutas de la API para el módulo de inspecciones.
 *
 * @description
 * Centraliza los endpoints utilizados por el datasource remoto
 * {@link InspectionsDatasourceRemoteImpl}, facilitando su mantenimiento
 * y reutilización.
 */
export class InspectionsEndpoints {
    /**
 * Endpoint base para operaciones de inspecciones.
 *
 * @example
 * GET `${BASE_URL}/inspection`
 * POST `${BASE_URL}/inspection`
 */
    static readonly PATH = `${BASE_URL}/inspection`;
    /**
 * Endpoint para recuperar la data inicial necesaria
 * para crear una nueva inspección.
 *
 * @example
 * GET `${BASE_URL}/inspection/data`
 */
    static readonly PATH_DATA = `${BASE_URL}/inspection/data`;
}
