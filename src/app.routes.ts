import { Routes } from '@angular/router';
import { AppLayout } from './app/feature/layout/component/app.layout';
import { NotfoundComponent } from './app/feature/layout/component/notfound/notfound.component';
import { InsightsPathRoutes } from './app/shared/routes/insights-path.routes';

export const appRoutes: Routes = [
    { path: '', redirectTo: InsightsPathRoutes.authLogin, pathMatch: 'full' },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: InsightsPathRoutes.insights, loadChildren: () => import('./app/shared/routes/insights.routes') }
        ]
    },
    //{ path: 'landing', component: Landing },
    { path: InsightsPathRoutes.notfound, component: NotfoundComponent },
    {
        path: InsightsPathRoutes.auth,
        loadChildren: () => import('./app/feature/authentication/presentation/routes/auth.routes')
    },
    { path: '**', redirectTo: InsightsPathRoutes.notfound }
];
