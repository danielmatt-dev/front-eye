import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { UserModel } from '../../data/models/user.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para restablecer la contraseña de un usuario.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, recibiendo un objeto
 * {@link ResetPasswordParams} que contiene al usuario y el token de
 * restablecimiento.  
 *
 * Delegado a {@link AuthenticationDatasourceRemoteImpl}, que se encarga de
 * enviar la petición HTTP al backend.
 */
export class ResetPassword implements UseCase<boolean, ResetPasswordParams> {
    /**
   * Constructor del caso de uso.
   *
   * @param remote Implementación del datasource remoto de autenticación.
   */
    constructor(
        private readonly remote: AuthenticationDatasourceRemoteImpl
    ) { }

    /**
   * Ejecuta el proceso de restablecimiento de contraseña.
   *
   * @param params Objeto con la información necesaria para restablecer la contraseña.
   * @returns Una promesa con un `Either`:
   * - `Right<boolean>` con `true` si la operación fue exitosa.
   * - `Left<Error>` en caso de error.
   *
   * @example
   * ```ts
   * const params = new ResetPasswordParams(
   *   new UserModel({ email: "user@mail.com", password: "newPass123" }),
   *   "reset-token-123"
   * );
   *
   * this.resetPassword.call(params).then(result => {
   *   if (result._tag === 'Right' && result.right) {
   *     console.log("Contraseña restablecida correctamente");
   *   } else {
   *     console.error("Error:", result.left);
   *   }
   * });
   * ```
   */
    call(params: ResetPasswordParams): Promise<Either<Error, boolean>> {
        return this.remote.resetPassword(params.user, params.resetToken)
    }

}

/**
 * Parámetros requeridos para el caso de uso {@link ResetPassword}.
 *
 * @description
 * Contiene el modelo de usuario con la nueva contraseña y
 * el token de restablecimiento necesario para autorizar la operación.
 */
export class ResetPasswordParams {
    /**
   * Datos del usuario, incluyendo la nueva contraseña.
   */
    user: UserModel

    /**
   * Token de restablecimiento proporcionado por el backend.
   *
   * @example "reset-token-123"
   */
    resetToken: string

    /**
     * Constructor de los parámetros para restablecer contraseña.
     *
     * @param user Usuario con los datos actualizados.
     * @param resetToken Token válido de restablecimiento de contraseña.
     */
    constructor(user: UserModel, resetToken: string) {
        this.user = user
        this.resetToken = resetToken
    }
}
