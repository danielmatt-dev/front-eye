import { UserModel } from '../../models/user.model';
import { Either } from 'fp-ts/Either';
import { AuthResponseModel } from '../../models/auth.response.model';

export interface AuthenticationDatasourceRemote {

    // <>
    login(user: UserModel): Promise<Either<Error, AuthResponseModel>>

}
