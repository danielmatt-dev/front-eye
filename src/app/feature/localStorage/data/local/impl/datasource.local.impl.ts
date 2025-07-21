import { Injectable } from '@angular/core';
import { DatasourceLocal } from '../datasource.local';
import { Theme } from '../../../../../shared/enums/enums';

@Injectable({
    providedIn: 'root'
})
export class DatasourceLocalImpl implements DatasourceLocal {

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setRole(role: string) {
        //const encodedRole = btoa(role);
        localStorage.setItem('role', role);
    }

    getRole(): string | null {
        return localStorage.getItem('role') ?? 'ADMIN';
    }

    setUsername(username: string): void {
        //const encodedUsername = btoa(username);
        localStorage.setItem('username', username);
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
        //return encodedUsername ? atob(encodedUsername) : null;
    }

    setExpiresAt(expiresAt: number): void {
        localStorage.setItem('expiresAt', expiresAt.toString());
    }

    getExpiresAt(): number {
        const raw = localStorage.getItem('expiresAt');
        if (raw === null) {
            // si no existe, devolvemos 0
            return 0;
        }
        const parsed = Number(raw);
        // si no es un número válido, también devolvemos 0
        return isNaN(parsed) ? 0 : parsed;
    }

    clear(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('role');
        localStorage.removeItem('reset_token');
    }

    getTheme(): Theme {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? (savedTheme as Theme) : Theme.light;
    }

    setTheme(theme: Theme): void {
        localStorage.setItem('theme', theme);
    }
}
