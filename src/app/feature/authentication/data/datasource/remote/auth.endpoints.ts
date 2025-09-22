import { BASE_URL } from '../../../../../shared/utils/base.url';

/**
 * Clase que centraliza los endpoints relacionados con la autenticación.
 *
 * @description
 * Define las rutas base utilizadas para interactuar con la API de autenticación.
 * Centralizar estos valores permite evitar cadenas duplicadas en el código y
 * facilita el mantenimiento de las rutas.
 */
export class AuthEndpoints {
    /**
     * Endpoint para el inicio de sesión de usuarios.
     *
     * @example "https://api.miapp.com/auth/login"
     */
    static readonly PATH_LOGIN = `${BASE_URL}/auth/login`;

    /**
     * Endpoint para restablecimiento de contraseña y validación de email.
     *
     * @example "https://api.miapp.com/auth/reset"
     */
    static readonly PATH_RESET = `${BASE_URL}/auth/reset`;
}
