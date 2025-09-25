import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local.storage.service';
import { routes } from '../routes/dict-routes';

@Injectable({ providedIn: 'root' })
export class RoleRedirectService {

    constructor(
        private readonly router: Router,
        private readonly local: LocalStorageService
    ) {}

    async redirectByRole() {

        const role = this.local.getRole()

        if (role === 'ADMIN') {
            await this.router.navigate([`/insights/${routes.dashboard}`])
        }

        if (role === 'DOCTOR') {
            await this.router.navigate([`/insights/${routes.newInspection}`])
        }

    }

}
