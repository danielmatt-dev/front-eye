import { Injectable } from '@angular/core';
import { Theme } from '../enums/enums';
import { DatasourceLocalImpl } from '../../feature/localStorage/data/local/impl/datasource.local.impl';

// <>
@Injectable({ providedIn: 'root' })
export class LocalStorageService {

    constructor(private readonly local: DatasourceLocalImpl) {}

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
