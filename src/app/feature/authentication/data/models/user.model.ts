export class UserModel {

    email: string

    password: string

    constructor(options: {
        email?: string
        password?: string
    } = {}) {
        this.email = options.email ?? ''
        this.password = options.password ?? ''
    }

}
