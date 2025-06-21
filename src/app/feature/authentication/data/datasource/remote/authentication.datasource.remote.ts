import { UserModel } from '../../models/user.model';
import { Either } from 'fp-ts/Either';
import { AuthResponseModel } from '../../models/auth.response.model';
import { RecoveryTokenModel } from '../../models/recovery.token.model';

export interface AuthenticationDatasourceRemote {

    // <>
    login(user: UserModel): Promise<Either<Error, AuthResponseModel>>

    validateEmail(email: string): Promise<Either<Error, RecoveryTokenModel>>

    resetPassword(user: UserModel): Promise<Either<Error, boolean>>

}
