import { Theme } from '../../../../shared/enums/enums';

export interface DatasourceLocal {
    setToken(token: string): void;

    getToken(): string | null;

    setRole(role: string): void;

    getRole(): string | null;

    setExpiresAt(expiresAt: number): void

    getExpiresAt(): number

    setTheme(theme: Theme): void

    getTheme(): Theme

    clear(): void

}
