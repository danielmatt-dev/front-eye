import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { right } from 'fp-ts/Either';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ValidateEmail implements UseCase<string, string> {

    constructor(
        private readonly remote: AuthenticationDatasourceRemoteImpl
    ) {}

    async call(params: string): Promise<Either<Error, string>> {
        const eitherResult = await this.remote.validateEmail(params, environment.recoveryToken)

        if (eitherResult._tag === 'Left') {
            return eitherResult
        }

        return right(eitherResult.right.resetToken)
    }

}
