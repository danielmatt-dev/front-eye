import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { right } from 'fp-ts/Either';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para validar la dirección de correo electrónico de un usuario.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, recibiendo como parámetro
 * un string con el correo electrónico y devolviendo un token de restablecimiento
 * en caso de éxito.  
 *
 * Utiliza {@link AuthenticationDatasourceRemoteImpl} para enviar la petición
 * de validación al backend, incluyendo el `recoveryToken` desde el
 * {@link environment}.
 */
export class ValidateEmail implements UseCase<string, string> {
    /**
   * Constructor del caso de uso.
   *
   * @param remote Implementación del datasource remoto de autenticación.
   */
    constructor(
        private readonly remote: AuthenticationDatasourceRemoteImpl
    ) { }

    /**
  * Ejecuta la validación de un correo electrónico.
  *
  * @param params Correo electrónico a validar.
  * @returns Una promesa con un `Either`:
  * - `Right<string>` con el token de restablecimiento si la validación es exitosa.
  * - `Left<Error>` si ocurre un error en el proceso.
  *
  * @example
  * ```ts
  * this.validateEmail.call("user@mail.com").then(result => {
  *   if (result._tag === 'Right') {
  *     console.log("Token de restablecimiento:", result.right);
  *   } else {
  *     console.error("Error:", result.left);
  *   }
  * });
  * ```
  */
    async call(params: string): Promise<Either<Error, string>> {
        const eitherResult = await this.remote.validateEmail(params, environment.recoveryToken)

        if (eitherResult._tag === 'Left') {
            return eitherResult
        }

        return right(eitherResult.right.resetToken)
    }
}
