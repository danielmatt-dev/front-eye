import { Expose } from 'class-transformer';

/**
 * Modelo que representa la respuesta de autenticación del backend.
 *
 * @description
 * Contiene la información devuelta después de un inicio de sesión exitoso,
 * incluyendo el token de acceso, rol del usuario, nombre de usuario y la
 * fecha de expiración del token.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear el campo `expires_at` del JSON
 * a la propiedad `expiresAt`.
 */
export class AuthResponseModel {
    /**
   * Token JWT devuelto por el backend después de una autenticación exitosa.
   *
   * @example "eyJhbGciOiJIUzI1NiIsInR..."
   */
    token: string = ''

    /**
   * Rol asignado al usuario autenticado.
   *
   * @example "ADMIN"
   */
    role: string = ''

    /**
   * Nombre de usuario asociado a la cuenta autenticada.
   *
   * @example "johndoe"
   */
    username: string = ''

    /**
   * Fecha de expiración del token en formato timestamp (epoch).
   *
   * @example 1735689600
   */
    @Expose({ name: 'expires_at' })
    expiresAt: number = 0

    /**
   * Constructor que permite inicializar el modelo
   * con un objeto parcial de sus propiedades.
   *
   * @param partial Objeto con propiedades opcionales para inicializar la instancia.
   *
   * @example
   * ```ts
   * const response = new AuthResponseModel({
   *   token: "eyJhbGciOiJIUzI1NiIsInR...",
   *   role: "USER",
   *   username: "janedoe",
   *   expiresAt: 1735689600
   * });
   * ```
   */
    constructor(partial?: Partial<AuthResponseModel>) {
        Object.assign(this, partial)
    }
}
