import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { DatasourceLocalImpl } from '../../../localStorage/data/local/impl/datasource.local.impl';
import { right } from 'fp-ts/Either';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserModel } from '../../data/models/user.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para iniciar sesión de un usuario.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, recibiendo un
 * {@link UserModel} con las credenciales del usuario y retornando un
 * `Either<Error, boolean>` que indica si la autenticación fue exitosa.
 *
 * Este caso de uso:
 * - Envía las credenciales al datasource remoto ({@link AuthenticationDatasourceRemoteImpl}).
 * - Guarda la información de sesión en el almacenamiento local ({@link DatasourceLocalImpl}).
 * - Inicia el monitoreo de expiración del token a través de {@link AuthService}.
 */
export class LoginUser implements UseCase<boolean, UserModel> {
    /**
   * Constructor del caso de uso.
   *
   * @param authService Servicio de autenticación que gestiona la expiración del token.
   * @param remote Implementación remota del datasource de autenticación.
   * @param local Implementación local del datasource para guardar datos de sesión.
   */
    constructor(
        private readonly authService: AuthService,
        private readonly remote: AuthenticationDatasourceRemoteImpl,
        private readonly local: DatasourceLocalImpl
    ) { }

    /**
       * Ejecuta el inicio de sesión de un usuario.
       *
       * @param params Objeto {@link UserModel} que contiene las credenciales del usuario.
       * @returns Una promesa con un `Either`:
       * - `Right<boolean>` con `true` si el inicio de sesión fue exitoso.
       * - `Left<Error>` si ocurre un error de autenticación.
       *
       * @example
       * ```ts
       * this.loginUser.call(new UserModel({
       *   email: "user@mail.com",
       *   password: "123456"
       * })).then(result => {
       *   if (result._tag === 'Right' && result.right) {
       *     console.log("Inicio de sesión correcto");
       *   } else {
       *     console.error("Error al iniciar sesión:", result.left);
       *   }
       * });
       * ```
       */
    async call(params: UserModel): Promise<Either<Error, boolean>> {

        const result = await this.remote.login(params)

        if (result._tag === 'Left') {
            return result
        }

        this.local.setToken(result.right.token)
        this.local.setRole(result.right.role)
        this.local.setUsername(result.right.username)
        const expiresAt = result.right.expiresAt
        this.local.setExpiresAt(expiresAt)
        await this.authService.startTokenExpirationWatcher(expiresAt)
        return right(true)
    }

}
