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
import { RoleGuard } from '../../shared/guards/role/role.guard';
import { authGuard } from '../../shared/guards/auth/auth.guard';

export default [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: 'datos-geograficos',
        component: DatosGeograficosComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: 'nueva-inspeccion',
        component: NuevaInspeccionComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: 'ver-detalle',
        component: VerDetalleInspeccionComponent,
        data: { roles: ['ADMIN', 'DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: 'todas-inspecciones',
        component: TodasInspeccionesComponent,
        data: { roles: ['ADMIN', 'DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: 'pacientes',
        component: PacientesComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: 'doctores',
        component: DoctorComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [authGuard, RoleGuard]
    },
    {
        path: '**', redirectTo: '/notfound' }
] as Routes;
