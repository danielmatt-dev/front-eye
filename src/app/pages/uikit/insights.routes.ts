import { Routes } from '@angular/router';
import { ReporteComponent } from '../../presentation/reporte/reporte.component';
import { DatosGeograficosComponent } from '../../presentation/datos-geograficos/datos-geograficos.component';
import { DashboardComponent } from '../../presentation/dashboard/dashboard.component';
import { NuevaInspeccionComponent } from '../../presentation/nueva-inspeccion/nueva-inspeccion.component';
import {
    VerDetalleInspeccionComponent
} from '../../presentation/ver-detalle-inspeccion/ver-detalle-inspeccion.component';
import { PacientesComponent } from '../../presentation/pacientes/pacientes.component';
import { TodasInspeccionesComponent } from '../../presentation/todas-inspecciones/todas-inspecciones.component';
import { DoctorComponent } from '../../presentation/doctor/doctor.component';
import { RoleGuard } from '../../guards/role.guard';

export default [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'reportes',
        component: ReporteComponent,
        data: { roles: ['ADMIN', 'DOCTOR'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'datos-geograficos',
        component: DatosGeograficosComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'nueva-inspeccion',
        component: NuevaInspeccionComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'ver-detalle',
        component: VerDetalleInspeccionComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'todas-inspecciones',
        component: TodasInspeccionesComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'pacientes',
        component: PacientesComponent,
        data: { roles: ['DOCTOR'] },
        canActivate: [RoleGuard]
    },
    {
        path: 'doctores',
        component: DoctorComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
    },
    {
        path: '**', redirectTo: '/notfound' }
] as Routes;
