import { Routes } from '@angular/router';
import { DatosGeograficosComponent } from '../../feature/patient/presentation/datos-geograficos/datos-geograficos.component';
import { DashboardComponent } from '../../feature/inspection/presentation/dashboard/dashboard.component';
import { NuevaInspeccionComponent } from '../../feature/inspection/presentation/nueva-inspeccion/nueva-inspeccion.component';
import {
    VerDetalleInspeccionComponent
} from '../../feature/inspection/presentation/ver-detalle-inspeccion/ver-detalle-inspeccion.component';
import { PacientesComponent } from '../../feature/patient/presentation/pacientes/pacientes.component';
import { TodasInspeccionesComponent } from '../../feature/inspection/presentation/todas-inspecciones/todas-inspecciones.component';
import { DoctorComponent } from '../../feature/doctor/presentation/doctor-component/doctor.component';
import { RoleGuard } from '../guards/role/role.guard';
import { authGuard } from '../guards/auth/auth.guard';
import { routes } from './dict-routes';

export default [
    {
        path: routes.dashboard,
        component: DashboardComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: routes.geographicData,
        component: DatosGeograficosComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: routes.newInspection,
        component: NuevaInspeccionComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: routes.viewDetail,
        component: VerDetalleInspeccionComponent,
        data: { roles: ['ADMIN', 'DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: routes.allInspections,
        component: TodasInspeccionesComponent,
        data: { roles: ['ADMIN', 'DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: routes.patients,
        component: PacientesComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: routes.doctors,
        component: DoctorComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: '**', redirectTo: '/notfound' }
] as Routes;
