import { Either } from 'fp-ts/lib/Either';
import { AuthResponseModel } from '../../../models/auth.response.model';
import { UserModel } from '../../../models/user.model';
import { AuthenticationDatasourceRemote } from '../authentication.datasource.remote';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../../shared/services/api.service';
import { AuthEndpoints } from '../auth.endpoints';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { ResetTokenModel } from '../../../models/resetTokenModel';

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

    validateEmail(email: string, recoveryToken: string): Promise<Either<Error, ResetTokenModel>> {
        const url = AuthEndpoints.PATH_RESET;

        const queryParams = new HttpParams()
            .set('email', email)

        const headers = new HttpHeaders({
            'Recovery-Token': recoveryToken
        })

        const obs$ = this.http
            .get<ResetTokenModel>(url, { headers: headers, params: queryParams })
            .pipe(
                map(response => plainToInstance(ResetTokenModel, response)))

        return this.apiService.sendRequest(obs$)
    }

    resetPassword(user: UserModel, resetToken: string): Promise<Either<Error, boolean>> {
        const url = AuthEndpoints.PATH_RESET;

        const headers = new HttpHeaders({
            'ResetPassword-Token': resetToken
        })

        const obs$ = this.http
            .post<boolean>(url, instanceToPlain(user), { headers: headers })
            .pipe(
                map(() => true))

        return this.apiService.sendRequest(obs$)
    }

}
