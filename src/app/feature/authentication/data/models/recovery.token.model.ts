import { Expose } from 'class-transformer';

export class RecoveryTokenModel {

    @Expose({ name: 'ResetPassword-Token' })
    recoveryToken: string = ''

    constructor(partial?: Partial<RecoveryTokenModel>) {
        Object.assign(this, partial)
    }

}
