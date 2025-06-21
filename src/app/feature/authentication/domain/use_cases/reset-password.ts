import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { UserEntity } from '../entity/user.entity';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResetPassword implements UseCase<boolean, ResetPasswordParams> {

    constructor(
        private readonly remote: AuthenticationDatasourceRemoteImpl
    ) {}

    call(params: ResetPasswordParams): Promise<Either<Error, boolean>> {
        return this.remote.resetPassword(params.user, params.resetToken)
    }

}

export class ResetPasswordParams {

    user: UserEntity
    resetToken: string

    constructor(user: UserEntity, resetToken: string) {
        this.user = user
        this.resetToken = resetToken
    }

}
