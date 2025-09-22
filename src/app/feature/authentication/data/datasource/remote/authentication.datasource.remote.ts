import { UserModel } from '../../models/user.model';
import { Either } from 'fp-ts/Either';
import { AuthResponseModel } from '../../models/auth.response.model';
import { ResetTokenModel } from '../../models/resetTokenModel';

/**
 * Contrato para las fuentes de datos remotas de autenticación.
 *
 * @description
 * Define los métodos que deben implementar las clases responsables de
 * comunicarse con el backend para realizar operaciones de autenticación,
 * validación de email y restablecimiento de contraseña.
 *
 * Implementaciones como {@link AuthenticationDatasourceRemoteImpl}
 * contienen la lógica concreta de comunicación con los endpoints.
 */
export interface AuthenticationDatasourceRemote {

    /**
 * Inicia sesión de usuario con sus credenciales.
 *
 * @param user Objeto {@link UserModel} que contiene los datos de inicio de sesión.
 * @returns Una promesa que resuelve un `Either`:
 * - `Right<AuthResponseModel>` si la autenticación es exitosa.
 * - `Left<Error>` si ocurre un error.
 *
 * @example
 * ```ts
 * datasource.login(new UserModel({ email: "test@mail.com", password: "1234" }))
 *   .then(result => {
 *     if (result._tag === 'Right') {
 *       console.log(result.right.accessToken);
 *     }
 *   });
 * ```
 */

    // <>
    login(user: UserModel): Promise<Either<Error, AuthResponseModel>>

    /**
   * Valida un email mediante un token de recuperación.
   *
   * @param email Dirección de correo electrónico a validar.
   * @param recoveryToken Token de recuperación proporcionado por el backend.
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<ResetTokenModel>` si la validación es exitosa.
   * - `Left<Error>` en caso de error.
   *
   * @example
   * ```ts
   * datasource.validateEmail("user@mail.com", "recoveryToken123")
   *   .then(result => {
   *     if (result._tag === 'Right') {
   *       console.log("Token válido:", result.right);
   *     }
   *   });
   * ```
   */
    validateEmail(email: string, recoveryToken: string): Promise<Either<Error, ResetTokenModel>>

    /**
   * Restablece la contraseña de un usuario.
   *
   * @param user Objeto {@link UserModel} con los datos del usuario (incluye la nueva contraseña).
   * @param resetToken Token de restablecimiento enviado por el backend.
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<boolean>` con `true` si la operación fue exitosa.
   * - `Left<Error>` si ocurre un error.
   *
   * @example
   * ```ts
   * datasource.resetPassword(user, "resetToken123")
   *   .then(result => {
   *     if (result._tag === 'Right' && result.right) {
   *       console.log("Contraseña restablecida con éxito");
   *     }
   *   });
   * ```
   */
    resetPassword(user: UserModel, resetToken: string): Promise<Either<Error, boolean>>

}
