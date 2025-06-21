import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import {
    AuthenticationDatasourceRemoteImpl
} from '../../data/datasource/remote/impl/authentication.datasource.remote.impl';
import { DatasourceLocalImpl } from '../../../localStorage/data/local/impl/datasource.local.impl';
import { right } from 'fp-ts/Either';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ValidateEmail implements UseCase<boolean, string> {

    constructor(
        private readonly remote: AuthenticationDatasourceRemoteImpl,
        private readonly local: DatasourceLocalImpl
    ) {}

    async call(params: string): Promise<Either<Error, boolean>> {
        const eitherResult = await this.remote.validateEmail(params, environment.recoveryToken)

        if (eitherResult._tag === 'Left') {
            return eitherResult
        }

        this.local.setResetToken(eitherResult.right.resetToken)
        return right(true)
    }

}
