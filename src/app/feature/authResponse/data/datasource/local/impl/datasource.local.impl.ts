import { Injectable } from '@angular/core';
import { DatasourceLocal } from '../datasource.local';
import { Theme } from '../../../../../../shared/enums/enums';

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
        localStorage.setItem('role', role);
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    clear(): void {
        localStorage.clear()
    }

    getTheme(): Theme {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? (savedTheme as Theme) : Theme.light;
    }

    setTheme(theme: Theme): void {
        localStorage.setItem('theme', theme);
    }

}
