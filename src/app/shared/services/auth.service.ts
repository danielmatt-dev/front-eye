import { from, Subscription, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private expirationSub?: Subscription;

    constructor(private readonly router: Router) {}

    async startTokenExpirationWatcher(expirationTime: number) {
        const now = Date.now();
        const marginMs = 2 * 60 * 60 * 1000;
        const delay = expirationTime - marginMs - now;

        if (delay <= 0) {
            await this.handleTokenExpired();
            return;
        }

        this.expirationSub = timer(delay).subscribe(() => {
            from(this.handleTokenExpired()).subscribe();
        });
    }

    private async handleTokenExpired() {
        await this.router.navigate(['/']);
    }

    stopTokenWatcher() {
        this.expirationSub?.unsubscribe();
    }

}
