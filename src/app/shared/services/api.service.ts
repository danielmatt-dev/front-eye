import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
    BadCredencialsException,
    BadRequestException,
    ForbiddenException, InternalServerException, NetworkException,
    ResourceNotFoundException, TimeoutException
} from '../exceptions/exceptions';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { Either, left, right } from 'fp-ts/Either';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {

    sendRequest<T>(obs$: Observable<T>): Promise<Either<Error, T>> {
        return firstValueFrom(
            obs$.pipe(
                map(data => right(data)),
                catchError((err: HttpErrorResponse) =>
                    of(left(this.mapException(err))))
            )
        )
    }

    private mapException(error: HttpErrorResponse): Error {
        switch (error.status) {
            case 0: return new NetworkException(error.message);
            case 400: return new BadRequestException(error.message);
            case 401: return new BadCredencialsException(error.message);
            case 403: return new ForbiddenException(error.message);
            case 404: return new ResourceNotFoundException(error.message);
            case 408: return new TimeoutException(error.message);
            case 500: return new InternalServerException(error.message);
            default:  return new Error(error.message);
        }
    }

}
