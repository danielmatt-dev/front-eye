/**
 * Modelo que representa a un usuario en el sistema.
 *
 * @description
 * Contiene la información básica requerida para procesos de autenticación,
 * incluyendo el correo electrónico y la contraseña del usuario.
 *
 * @example
 * ```ts
 * const user = new UserModel({
 *   email: "user@mail.com",
 *   password: "123456"
 * });
 * ```
 */
export class UserModel {
    /**
   * Dirección de correo electrónico del usuario.
   *
   * @example "user@mail.com"
   */
    email: string

    /**
   * Contraseña asociada a la cuenta del usuario.
   *
   * @example "123456"
   */
    password: string

    /**
   * Constructor que permite inicializar el modelo con opciones parciales.
   *
   * @param options Objeto con propiedades opcionales para inicializar la instancia.
   */
    constructor(options: {
        email?: string
        password?: string
    } = {}) {
        this.email = options.email ?? ''
        this.password = options.password ?? ''
    }

}
