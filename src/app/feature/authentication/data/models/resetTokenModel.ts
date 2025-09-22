import { Expose } from 'class-transformer';

/**
 * Modelo que representa un token de restablecimiento de contraseña.
 *
 * @description
 * Se utiliza durante el proceso de recuperación de cuenta para validar
 * y autorizar el cambio de contraseña de un usuario.
 *
 * @remarks
 * Utiliza `class-transformer` para mapear el campo `ResetPassword-Token`
 * del JSON a la propiedad `resetToken`.
 */
export class ResetTokenModel {
    /**
   * Token temporal emitido por el backend para permitir el restablecimiento de contraseña.
   *
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
    @Expose({ name: 'ResetPassword-Token' })
    resetToken: string = ''

    /**
   * Constructor que permite inicializar el modelo
   * con un objeto parcial de sus propiedades.
   *
   * @param partial Objeto con propiedades opcionales para inicializar la instancia.
   *
   * @example
   * ```ts
   * const token = new ResetTokenModel({
   *   resetToken: "eyJhbGciOiJIUzI1NiIsInR..."
   * });
   * ```
   */
    constructor(partial?: Partial<ResetTokenModel>) {
        Object.assign(this, partial)
    }

}
