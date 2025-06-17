import { Expose } from 'class-transformer';

export class AuthResponseModel {

    token: string = ''

    role: string = ''

    @Expose({ name: 'expires_at' })
    expiresAt: number = 0

    constructor(partial?: Partial<AuthResponseModel>) {
        Object.assign(this, partial)
    }

}
