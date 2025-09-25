import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { InsightsPathRoutes } from '../../routes/insights-path.routes';

export const authGuard: CanActivateFn = async (_, state) => {

    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Redirige si el usuario no está autenticado
    if (state.url !== InsightsPathRoutes.authLogin) {
        await router.navigate([InsightsPathRoutes.authLogin]);
    }

    return false;
};
