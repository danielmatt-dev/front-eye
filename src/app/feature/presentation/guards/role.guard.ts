import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DatasourceLocalImpl } from '../../authResponse/data/datasource/local/impl/datasource.local.impl';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly local: DatasourceLocalImpl
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
