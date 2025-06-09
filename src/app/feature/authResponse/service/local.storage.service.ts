import { Injectable } from '@angular/core';
import { Theme } from '../../../shared/enums/enums';
import { DatasourceLocalImpl } from '../data/local/impl/datasource.local.impl';

// <>
@Injectable({ providedIn: 'root' })
export class LocalStorageService {

    constructor(private readonly local: DatasourceLocalImpl) {}

    setToken(token: string) {
        this.local.setToken(token)
    }

    getToken(): string | null {
        return this.local.getToken()
    }

    setRole(role: string) {
        this.local.setRole(role)
    }

    getRole(): string | null {
        return this.local.getRole()
    }

    setTheme(theme: Theme) {
        this.local.setTheme(theme)
    }

    getTheme(): Theme {
        return this.local.getTheme()
    }

    clear() {
        this.local.clear()
    }

}
