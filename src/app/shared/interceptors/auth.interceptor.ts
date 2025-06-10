import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../services/local.storage.service';

export function authInterceptorFn(
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> {

    if (req.url.endsWith('/auth/login')) {
        return next(req)
    }

    const token = inject(LocalStorageService).getToken();
    const authReq = req.clone({
        setHeaders: {
            Authorization: token ? `Bearer ${token}` : environment.token,
            'Content-Type': 'application/json'
        }
    });
    return next(authReq);
}
