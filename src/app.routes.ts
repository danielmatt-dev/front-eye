import { Routes } from '@angular/router';
import { AppLayout } from './app/feature/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { authRedirectGuard } from './app/shared/guards/redirect/auth-redirect.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'insights', loadChildren: () => import('./app/pages/uikit/insights.routes') }
        ]
    },
    //{ path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        loadChildren: () => import('./app/feature/authentication/presentation/routes/auth.routes'),
        canActivate: [authRedirectGuard]
    },
    { path: '**', redirectTo: '/notfound' }
];
