import { UserModel } from '../../models/user.model';
import { Either } from 'fp-ts/Either';
import { AuthResponseModel } from '../../models/auth.response.model';
import { ResetTokenModel } from '../../models/resetTokenModel';

export interface AuthenticationDatasourceRemote {

    // <>
    login(user: UserModel): Promise<Either<Error, AuthResponseModel>>

    validateEmail(email: string, recoveryToken: string): Promise<Either<Error, ResetTokenModel>>

    resetPassword(user: UserModel, resetToken: string): Promise<Either<Error, boolean>>

}
