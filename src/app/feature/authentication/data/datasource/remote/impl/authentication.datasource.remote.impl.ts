import { Either } from 'fp-ts/lib/Either';
import { AuthResponseModel } from '../../../models/auth.response.model';
import { UserModel } from '../../../models/user.model';
import { AuthenticationDatasourceRemote } from '../authentication.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { AuthEndpoints } from '../auth.endpoints';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { ResetTokenModel } from '../../../models/resetTokenModel';

@Injectable({ providedIn: 'root' })
/**
 * Implementación remota del datasource de autenticación.
 *
 * @description
 * Se encarga de manejar las peticiones HTTP hacia los endpoints de
 * autenticación definidos en {@link AuthEndpoints}, incluyendo:
 * - Inicio de sesión.
 * - Validación de email con token de recuperación.
 * - Restablecimiento de contraseña.
 *
 * Utiliza `HttpClient` para enviar solicitudes y `ApiService` para
 * gestionar respuestas consistentes en un `Either`.
 *
 * Implementa la interfaz {@link AuthenticationDatasourceRemote}.
 */
export class AuthenticationDatasourceRemoteImpl implements AuthenticationDatasourceRemote {
    /**
     * Constructor del datasource remoto de autenticación.
     *
     * @param http Cliente HTTP de Angular para realizar las solicitudes.
     * @param apiService Servicio común para enviar solicitudes y manejar respuestas.
     */
    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) { }

    /**
 * Inicia sesión de usuario con sus credenciales.
 *
 * @param user Datos del usuario (ejemplo: email y contraseña).
 * @returns Una promesa con un `Either`:
 * - `Right<AuthResponseModel>` si la autenticación es exitosa.
 * - `Left<Error>` si ocurre un error.
 *
 * @example
 * ```ts
 * this.authDatasource.login(user).then(result => {
 *   if (result._tag === 'Right') {
 *     console.log('Token:', result.right.accessToken);
 *   } else {
 *     console.error(result.left);
 *   }
 * });
 * ```
 */
    login(user: UserModel): Promise<Either<Error, AuthResponseModel>> {
        const url = AuthEndpoints.PATH_LOGIN
        const obs$ = this.http
            .post<AuthResponseModel>(url, instanceToPlain(user))
            .pipe(
                map(response =>
                    plainToInstance(AuthResponseModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    /**
  * Valida un email utilizando un token de recuperación.
  *
  * @param email Dirección de correo a validar.
  * @param recoveryToken Token de recuperación enviado por el backend.
  * @returns Una promesa con un `Either`:
  * - `Right<ResetTokenModel>` si la validación es exitosa.
  * - `Left<Error>` en caso de error.
  *
  * @example
  * ```ts
  * this.authDatasource.validateEmail("user@mail.com", "token123")
  *   .then(result => {
  *     if (result._tag === 'Right') {
  *       console.log('Token válido:', result.right);
  *     }
  *   });
  * ```
  */
    validateEmail(email: string, recoveryToken: string): Promise<Either<Error, ResetTokenModel>> {
        const url = AuthEndpoints.PATH_RESET;

        const queryParams = new HttpParams()
            .set('email', email)

        const headers = new HttpHeaders({
            'Recovery-Token': recoveryToken
        })

        const obs$ = this.http
            .get<ResetTokenModel>(url, { headers: headers, params: queryParams })
            .pipe(
                map(response => plainToInstance(ResetTokenModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    /**
  * Restablece la contraseña de un usuario usando un token de validación.
  *
  * @param user Datos del usuario, incluyendo la nueva contraseña.
  * @param resetToken Token de restablecimiento enviado por el backend.
  * @returns Una promesa con un `Either`:
  * - `Right<boolean>` con `true` si la operación fue exitosa.
  * - `Left<Error>` en caso de fallo.
  *
  * @example
  * ```ts
  * this.authDatasource.resetPassword(user, "reset-token")
  *   .then(result => {
  *     if (result._tag === 'Right' && result.right) {
  *       console.log('Contraseña restablecida con éxito');
  *     }
  *   });
  * ```
  */
    resetPassword(user: UserModel, resetToken: string): Promise<Either<Error, boolean>> {
        const url = AuthEndpoints.PATH_RESET;

        const headers = new HttpHeaders({
            'ResetPassword-Token': resetToken
        })

        const obs$ = this.http
            .post<boolean>(url, instanceToPlain(user), { headers: headers })
            .pipe(
                map(() => true))

        return this.apiService.sendRequest(obs$)
    }
}
