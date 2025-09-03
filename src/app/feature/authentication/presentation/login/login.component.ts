import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { LoginUser } from '../../domain/use_cases/login.user';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { NgClass, NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { RoleRedirectService } from '../../../../shared/services/role.redirect.service';
import { SendMessage } from '../../../../shared/toast/send.message';
import { UserModel } from '../../data/models/user.model';

@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, TranslatePipe, AppFloatingConfigurator, NgClass, NgIf, ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    /* Variables del usuario */
    email: string = '';
    password: string = '';

    /* Variables del html */
    isLoading = false;

    /* Variables de error */
    emailError?: string;
    passwordError?: string;

    // Providers
    validator: BaseValidatorHelper;

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly roleRedirect: RoleRedirectService,
        private readonly login: LoginUser
    ) {
        this.validator = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    // Llamada a casos de uso
    async callLogin() {

        if (!this.isFormValid()) {
            this.validator.showMessage({ key: 'invalidForm' });
            return;
        }

        this.isLoading = true;
        const resultLoginUser = await this.login.call(
            new UserModel({
                email: this.email,
                password: this.password
            })
        );
        this.isLoading = false;

        if (resultLoginUser._tag === 'Left') {
            this.validator.getToastException(resultLoginUser.left);
        }

        if (resultLoginUser._tag === 'Right') {
            await this.redirect();
            this.clearFields()
        }
    }

    // Validación
    validateEmail() {
        this.emailError = this.validator.validateEmail(this.email);
    }

    validatePassword() {
        this.passwordError = this.validator.validatePassword(this.password);
    }

    isFormValid(): boolean {
        this.validateEmail();
        this.validatePassword();
        return !(this.emailError ?? this.passwordError);
    }

    async redirect() {
        await this.roleRedirect.redirectByRole()
    }

    clearFields() {
        this.email = ''
        this.password = ''

        this.emailError = undefined
        this.passwordError = undefined
    }

    onEmailChange() {
        this.emailError = undefined
    }

    onPasswordChange() {
        this.passwordError = undefined
    }

}
