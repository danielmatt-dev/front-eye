import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services/local.storage.service';
import { authPathRoutes } from '../../routes/dict-routes';

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

        this.router.navigate([`/auth/${authPathRoutes.access}`]).then(() => {})
        return false
    }

}
