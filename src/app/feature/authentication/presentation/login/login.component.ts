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

/**
 * Componente de pantalla de inicio de sesión.
 *
 * @description
 * Muestra el formulario de login con validación de campos y conexión
 * al caso de uso {@link LoginUser}.  
 * Incluye:
 * - Validación de email y contraseña mediante {@link BaseValidatorHelper}.
 * - Mensajes de error y notificaciones con PrimeNG `MessageService`.
 * - Redirección según rol del usuario con {@link RoleRedirectService}.
 */
@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, TranslatePipe, AppFloatingConfigurator, NgClass, NgIf, ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    /** Dirección de correo ingresada por el usuario. */
    email: string = '';

    /** Contraseña ingresada por el usuario. */
    password: string = '';

    /** Indica si el proceso de login está en curso. */
    isLoading = false;

    /** Mensaje de error relacionado con el campo email. */
    emailError?: string;

    /** Mensaje de error relacionado con el campo password. */
    passwordError?: string;

    // Providers
    /** Helper de validación para email y contraseña. */
    validator: BaseValidatorHelper;

    /**
 * Constructor del componente de login.
 *
 * @param messageService Servicio de notificaciones de PrimeNG.
 * @param translateService Servicio de traducción (ngx-translate).
 * @param primeng Configuración global de PrimeNG.
 * @param roleRedirect Servicio para redirigir según rol de usuario.
 * @param login Caso de uso {@link LoginUser} para autenticar al usuario.
 */
    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly roleRedirect: RoleRedirectService,
        private readonly login: LoginUser
    ) {
        this.validator = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    /**
  * Ejecuta el proceso de login del usuario.
  *
  * @description
  * Valida el formulario, invoca al caso de uso {@link LoginUser}, 
  * maneja errores y redirige al usuario si la autenticación es exitosa.
  */
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
    /** Valida el campo email y establece `emailError` si es inválido. */
    validateEmail() {
        this.emailError = this.validator.validateEmail(this.email);
    }

    /** Valida el campo password y establece `passwordError` si es inválido. */
    validatePassword() {
        this.passwordError = this.validator.validatePassword(this.password);
    }

    /**
 * Verifica si el formulario es válido.
 * @returns `true` si no hay errores de validación.
 */
    isFormValid(): boolean {
        this.validateEmail();
        this.validatePassword();
        return !(this.emailError ?? this.passwordError);
    }

    /** Redirige al usuario según su rol utilizando {@link RoleRedirectService}. */
    async redirect() {
        await this.roleRedirect.redirectByRole()
    }

    /** Limpia los campos del formulario y resetea los mensajes de error. */
    clearFields() {
        this.email = ''
        this.password = ''

        this.emailError = undefined
        this.passwordError = undefined
    }

    /** Limpia el mensaje de error del campo email al modificarlo. */
    onEmailChange() {
        this.emailError = undefined
    }

    /** Limpia el mensaje de error del campo password al modificarlo. */
    onPasswordChange() {
        this.passwordError = undefined
    }

}
