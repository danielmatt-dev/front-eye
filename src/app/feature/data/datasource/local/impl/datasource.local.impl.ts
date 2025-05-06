import { Injectable } from '@angular/core';

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
        return localStorage.getItem('role')
    }

}
