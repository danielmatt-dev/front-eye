import { from, Subscription, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local.storage.service';
import { authPathRoutes } from '../routes/dict-routes';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private expirationSub?: Subscription;
    private marginMs = 2 * 60 * 60 * 1000

    constructor(
        private readonly router: Router,
        private readonly local: LocalStorageService
    ) {}

    async startTokenExpirationWatcher(expirationTime: number) {
        const now = Date.now();
        const delay = expirationTime - this.marginMs - now;

        if (delay <= 0) {
            await this.handleTokenExpired();
            return;
        }

        this.expirationSub = timer(delay).subscribe(() => {
            from(this.handleTokenExpired()).subscribe();
        });
    }

    isAuthenticated(): boolean {
        const token = this.local.getToken();
        const expiresAt = this.local.getExpiresAt();

        if (!token?.trim() || !expiresAt) {
            return false;
        }

        const now = Date.now();
        return (expiresAt - this.marginMs) > now;
    }

    private async handleTokenExpired() {
        await this.router.navigate([`/auth/${authPathRoutes.login}`]);
        this.local.clear()
    }

    stopTokenWatcher() {
        this.expirationSub?.unsubscribe();
    }

}
