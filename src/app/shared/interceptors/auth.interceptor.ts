import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from '../../feature/authResponse/service/local.storage.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export function authInterceptorFn(
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> {

    const token = inject(LocalStorageService).getToken();
    const authReq = req.clone({
        setHeaders: {
            Authorization: token ? `Bearer ${token}` : environment.token,
            'Content-Type': 'application/json'
        }
    });
    return next(authReq);
}
