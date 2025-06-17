import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local.storage.service';

export function authInterceptorFn(
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> {

    if (req.url.endsWith('/auth/login')) {
        return next(req)
    }

    const token = inject(LocalStorageService).getToken();

    if (token === null) {
        // Excepción de volver a loguearse
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return next(authReq);
}
