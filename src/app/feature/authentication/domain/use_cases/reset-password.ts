import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { UserModel } from '../../data/models/user.model';

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

    user: UserModel
    resetToken: string

    constructor(user: UserModel, resetToken: string) {
        this.user = user
        this.resetToken = resetToken
    }

}
