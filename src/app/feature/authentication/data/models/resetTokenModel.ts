import { Expose } from 'class-transformer';

export class ResetTokenModel {

    @Expose({ name: 'ResetPassword-Token' })
    resetToken: string = ''

    constructor(partial?: Partial<ResetTokenModel>) {
        Object.assign(this, partial)
    }

}
