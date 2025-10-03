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

/**
 * Componente de pantalla para restablecimiento de contraseña.
 *
 * @description
 * Muestra un formulario en dos pasos:
 * 1. Validar el email ingresado (se obtiene un token de recuperación).
 * 2. Permitir el cambio de contraseña ingresando la nueva contraseña
 *    y su confirmación.
 *
 * Utiliza los casos de uso:
 * - {@link ValidateEmail} para validar el correo.
 * - {@link ResetPassword} para restablecer la contraseña.
 *
 * También usa {@link BaseValidatorHelper} para validaciones de campos
 * y notificaciones con PrimeNG.
 */
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
    /** Dirección de correo electrónico ingresada por el usuario. */
    email: string = '';

    /** Nueva contraseña del usuario. */
    password: string = '';

    /** Confirmación de la nueva contraseña. */
    confirmPassword: string = '';

    /* Variables del html */
    /** Indica si el campo de email está habilitado (primer paso). */
    isEnabledEmail = true;

    /** Indica si se está ejecutando un proceso (loading). */
    isLoading = false;

    /* Variables de error */
    /** Error de validación en el email. */
    emailError?: string;

    /** Error de validación en la contraseña. */
    passwordError?: string;

    /** Error de validación en la confirmación de contraseña. */
    confirmPasswordError?: string;

    /** Token temporal para el restablecimiento de contraseña. */
    token: string = '';

    /** Helper de validación de campos. */
    validator: BaseValidatorHelper;

    /**
 * Constructor del componente ResetPassword.
 *
 * @param messageService Servicio de mensajes (PrimeNG).
 * @param translateService Servicio de traducción.
 * @param primeng Configuración de PrimeNG.
 * @param validateEmail Caso de uso para validar email.
 * @param resetPassword Caso de uso para restablecer contraseña.
 */
    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly validateEmail: ValidateEmail,
        private readonly resetPassword: ResetPassword
    ) {
        this.validator = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    /**
    * Ejecuta el flujo de casos de uso.
    *
    * - Si `isEnabledEmail = true`, valida el correo electrónico.
    * - Si `isEnabledEmail = false`, intenta restablecer la contraseña.
    */
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

    /**
 * Llama al caso de uso {@link ValidateEmail} para validar el correo electrónico.
 *
 * - Muestra mensaje de error si el email no está registrado.
 * - En caso de éxito, habilita los campos de nueva contraseña y guarda el token.
 */
    async callValidateEmail() {
        if (!this.isEmailValid()) {
            return;
        }

        const resultValidateEmail = await this.validateEmail.call(this.email.trim());

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
            this.validator.showMessage({ key: 'emailValidationSuccess', type: 'success' })
        }
    }

    /**
 * Llama al caso de uso {@link ResetPassword} para restablecer la contraseña.
 *
 * - Valida la contraseña y confirmación.
 * - Envía el email, nueva contraseña y token de restablecimiento.
 */
    async callResetPassword() {
        if (!this.isPasswordValid()) {
            return;
        }

        const user = new UserModel({ email: this.email.trim(), password: this.password.trim() });

        const resultResetPassword = await this.resetPassword.call(new ResetPasswordParams(user, this.token));

        if (resultResetPassword._tag === 'Left') {
            this.validator.getToastException(resultResetPassword.left);
        }

        if (resultResetPassword._tag === 'Right') {
            this.validator.showMessage({ key: 'passwordResetSuccess', type: 'success', life: 5000 })
            this.clearFields();
        }
    }

    /* Validaciones */
    /** Evento al cambiar el campo email → valida formato. */
    onEmailChange() {
        this.emailError = this.validator.validateEmail(this.email);
    }

    /** Evento al cambiar el campo password → valida seguridad. */
    onPasswordChange() {
        this.passwordError = this.validator.validatePassword(this.password);
    }

    /** Evento al cambiar confirmPassword → valida coincidencia con password. */
    onConfirmPasswordChange() {
        this.confirmPasswordError = this.validator.validateConfirmPassword(this.confirmPassword, this.password);
    }

    /** Verifica si el email es válido. */
    isEmailValid(): boolean {
        this.onEmailChange();
        return !this.emailError;
    }

    /** Verifica si las contraseñas son válidas. */
    isPasswordValid(): boolean {
        this.onPasswordChange();
        this.onConfirmPasswordChange();
        return !(this.passwordError ?? this.confirmPasswordError);
    }

    /** Limpia todos los campos y resetea el formulario. */
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
