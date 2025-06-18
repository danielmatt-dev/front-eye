import { Routes } from '@angular/router';
import { AppLayout } from './app/feature/layout/component/app.layout';
import { NotfoundComponent } from './app/feature/layout/component/notfound/notfound.component';

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
    { path: 'notfound', component: NotfoundComponent },
    {
        path: 'auth',
        loadChildren: () => import('./app/feature/authentication/presentation/routes/auth.routes')
    },
    { path: '**', redirectTo: '/notfound' }
];
