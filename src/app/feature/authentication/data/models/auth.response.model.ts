import { Expose } from 'class-transformer';

export class AuthResponseModel {

    token: string

    role: string

    @Expose({ name: 'expires_at' })
    expiresAt: number

    constructor(options: {
        token?: string
        role?: string
        expiresAt?: number
    } = {}) {
        this.token = options.token ?? ''
        this.role = options.role ?? ''
        this.expiresAt = options.expiresAt ?? 0
    }

}
