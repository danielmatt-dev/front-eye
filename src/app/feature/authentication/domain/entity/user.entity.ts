import { UserModel } from '../../data/models/user.model';

export class UserEntity extends UserModel {

    constructor(options: {
        email?: string
        password?: string
    } = {}) {
        super({
            email: options.email,
            password: options.password
        });
    }

}
