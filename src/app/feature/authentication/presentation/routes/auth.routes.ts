import { Routes } from '@angular/router';
import { AccessComponent } from '../access/access.component';
import { LoginComponent } from '../login/login.component';
import { authRedirectGuard } from '../../../../shared/guards/redirect/auth-redirect.guard';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { authPathRoutes } from '../../../../shared/routes/dict-routes';

/**
 * Definición de rutas del módulo de autenticación.
 *
 * @description
 * Contiene las rutas principales relacionadas con la autenticación de usuarios:
 * - `/auth/access` → Pantalla de acceso denegado.
 * - `/auth/login` → Pantalla de login (protegida por `authRedirectGuard`).
 * - `/auth/reset` → Pantalla para restablecimiento de contraseña.
 *
 * @remarks
 * Se exporta como `Routes` para ser usado en el enrutador de Angular.
 */
export default [
    /** Ruta para acceso denegado */
    { path: authPathRoutes.access, component: AccessComponent },

    /** Ruta de login con guard para redirección si ya está autenticado */
    {
        path: authPathRoutes.login,
        component: LoginComponent,
        canActivate: [authRedirectGuard]
    },

    /** Ruta para restablecimiento de contraseña */
    {
        path: authPathRoutes.reset, component: ResetPasswordComponent
    }
] as Routes;
