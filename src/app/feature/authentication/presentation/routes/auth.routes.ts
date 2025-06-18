import { Routes } from '@angular/router';
import { AccessComponent } from '../access/access.component';
import { LoginComponent } from '../login/login.component';
import { authRedirectGuard } from '../../../../shared/guards/redirect/auth-redirect.guard';

export default [
    { path: 'access', component: AccessComponent },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [authRedirectGuard]
    }
] as Routes;
