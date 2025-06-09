import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../authResponse/service/local.storage.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly local: LocalStorageService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot
    ): boolean {

        const userRole = this.local.getRole()
        const allowedRoles: string[] = route.data['roles']

        if (userRole && allowedRoles.includes(userRole)) {
            return true
        }

        if (userRole === 'ADMIN') {
            this.router.navigate(['/insights/dashboard']).then(() => {})
            return false
        }

        if (userRole === 'DOCTOR') {
            this.router.navigate(['/insights/nueva-inspeccion']).then(() => {})
            return false
        }

        return false

    }

}
