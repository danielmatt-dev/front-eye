import { Component } from '@angular/core';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { Password } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ValidateEmail } from '../../domain/use_cases/validate-email';
import { ResetPassword, ResetPasswordParams } from '../../domain/use_cases/reset-password';
import { ResourceNotFoundException } from '../../../../shared/exceptions/exceptions';
import { RouterLink } from '@angular/router';
import { SendMessage } from '../../../../shared/toast/send.message';
import { UserModel } from '../../data/models/user.model';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [AppFloatingConfigurator, Button, InputText, NgIf, Password, ReactiveFormsModule, Toast, TranslatePipe, NgClass, FormsModule, RouterLink],
    providers: [MessageService],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
    /* Variables del usuario */
    email: string = '';
    password: string = '';
    confirmPassword: string = '';

    /* Variables del html */
    isEnabledEmail = true;
    isLoading = false;

    /* Variables de error */
    emailError?: string;
    passwordError?: string;
    confirmPasswordError?: string;

    /* Token para reestablecer password */
    token: string = '';

    // Providers
    validator: BaseValidatorHelper;

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly validateEmail: ValidateEmail,
        private readonly resetPassword: ResetPassword
    ) {
        this.validator = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    /* Llamas a casos de uso */
    async callUseCase() {

        if (!this.isEnabledEmail) {
            this.isLoading = true;
            await this.callResetPassword();
            this.isLoading = false;
            return;
        }

        this.isLoading = true;
        await this.callValidateEmail();
        this.isLoading = false;
    }

    async callValidateEmail() {
        if (!this.isEmailValid()) {
            return;
        }

        const resultValidateEmail = await this.validateEmail.call(this.email);

        if (resultValidateEmail._tag === 'Left') {
            if (resultValidateEmail.left instanceof ResourceNotFoundException) {
                this.validator.showMessage({ key: 'emailNotRegistered', typeToast: 'exception' });
                return;
            }

            this.validator.getToastException(resultValidateEmail.left);
        }

        if (resultValidateEmail._tag === 'Right') {
            this.isEnabledEmail = false;
            this.token = resultValidateEmail.right;
            this.validator.showMessage({ key:'emailValidationSuccess', type: 'success' })
        }
    }

    async callResetPassword() {
        if (!this.isPasswordValid()) {
            return;
        }

        const user = new UserModel({ email: this.email, password: this.password });

        const resultResetPassword = await this.resetPassword.call(new ResetPasswordParams(user, this.token));

        if (resultResetPassword._tag === 'Left') {
            this.validator.getToastException(resultResetPassword.left);
        }

        if (resultResetPassword._tag === 'Right') {
            this.validator.showMessage({ key:'passwordResetSuccess', type: 'success', life: 5000 })
            this.clearFields();
        }
    }

    /* Validaciones */
    onEmailChange() {
        this.emailError = this.validator.validateEmail(this.email);
    }

    onPasswordChange() {
        this.passwordError = this.validator.validatePassword(this.password);
    }

    onConfirmPasswordChange() {
        this.confirmPasswordError = this.validator.validateConfirmPassword(this.confirmPassword, this.password);
    }

    isEmailValid(): boolean {
        this.onEmailChange();
        return !this.emailError;
    }

    isPasswordValid(): boolean {
        this.onPasswordChange();
        this.onConfirmPasswordChange();
        return !(this.passwordError ?? this.confirmPasswordError);
    }

    clearFields() {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';

        this.emailError = undefined;
        this.passwordError = undefined;
        this.confirmPasswordError = undefined;

        this.isEnabledEmail = true;
    }

}
