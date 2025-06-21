import { Either } from 'fp-ts/lib/Either';
import { AuthResponseModel } from '../../../models/auth.response.model';
import { UserModel } from '../../../models/user.model';
import { AuthenticationDatasourceRemote } from '../authentication.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { AuthEndpoints } from '../auth.endpoints';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { RecoveryTokenModel } from '../../../models/recovery.token.model';

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

    validateEmail(email: string): Promise<Either<Error, RecoveryTokenModel>> {
        const url = AuthEndpoints.PATH_RESET;

        const params = new HttpParams()
            .set('email', email)

        const obs$ = this.http
            .get<RecoveryTokenModel>(url, { params })
            .pipe(
                map(response => plainToInstance(RecoveryTokenModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    resetPassword(user: UserModel): Promise<Either<Error, boolean>> {
        const url = AuthEndpoints.PATH_RESET;
        const obs$ = this.http
            .post<boolean>(url, instanceToPlain(user))
            .pipe(
                map(() => true))

        return this.apiService.sendRequest(obs$)
    }

}
