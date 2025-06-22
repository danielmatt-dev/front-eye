import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { UserEntity } from '../entity/user.entity';
import { Injectable } from '@angular/core';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { DatasourceLocalImpl } from '../../../localStorage/data/local/impl/datasource.local.impl';
import { right } from 'fp-ts/Either';
import { AuthService } from '../../../../shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginUser implements UseCase<boolean, UserEntity> {

    constructor(
        private readonly authService: AuthService,
        private readonly remote: AuthenticationDatasourceRemoteImpl,
        private readonly local: DatasourceLocalImpl
    ) {}

    async call(params: UserEntity): Promise<Either<Error, boolean>> {

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
