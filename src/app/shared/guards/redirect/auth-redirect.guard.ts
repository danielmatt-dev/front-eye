import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RoleRedirectService } from '../../services/role.redirect.service';

export const authRedirectGuard: CanActivateFn = async (_, state) => {

    const roleRedirect = inject(RoleRedirectService);
    const authService = inject(AuthService);

    if (authService.isAuthenticated()) {
        await roleRedirect.redirectByRole()
        return false;
    }

    return true;
}
