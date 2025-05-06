interface DatasourceLocal {
    setToken(token: string): void;

    getToken(): string | null;

    setRole(role: string): void;

    getRole(): string | null;

    clear(): void

}
