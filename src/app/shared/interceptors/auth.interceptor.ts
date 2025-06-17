import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local.storage.service';
import { TokenNotFoundException } from '../exceptions/exceptions';

export function authInterceptorFn(
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> {

    if (req.url.endsWith('/auth/login')) {
        return next(req)
    }

    const token = inject(LocalStorageService).getToken();

    if (token === null) {
        return throwError(() => new TokenNotFoundException());
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return next(authReq);
}
