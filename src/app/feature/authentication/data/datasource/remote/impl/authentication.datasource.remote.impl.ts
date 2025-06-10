import { Either } from 'fp-ts/lib/Either';
import { AuthResponseModel } from '../../../models/auth.response.model';
import { UserModel } from '../../../models/user.model';
import { AuthenticationDatasourceRemote } from '../authentication.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { AuthEndpoints } from '../auth.endpoints';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationDatasourceRemoteImpl implements AuthenticationDatasourceRemote {

    constructor(
        private readonly http: HttpClient,
        private readonly apiService: ApiService
    ) {}

    login(user: UserModel): Promise<Either<Error, AuthResponseModel>> {
        const url = AuthEndpoints.PATH_LOGIN
        const obs$ = this.http
            .post<AuthResponseModel>(url, instanceToPlain(user))
            .pipe(
                map(response =>
                    plainToInstance(AuthResponseModel, response)))

        return this.apiService.sendRequest(obs$)
    }

}
