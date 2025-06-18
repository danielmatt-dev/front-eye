import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local.storage.service';

@Injectable({ providedIn: 'root' })
export class RoleRedirectService {

    constructor(
        private router: Router,
        private local: LocalStorageService
    ) {}

    async redirectByRole() {

        const role = this.local.getRole()

        if (role === 'ADMIN') {
            await this.router.navigate(['/insights/dashboard'])
        }

        if (role === 'DOCTOR') {
            await this.router.navigate(['/insights/nueva-inspeccion'])
        }

    }

}
