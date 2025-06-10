import { Routes } from '@angular/router';
import { ReporteComponent } from '../../feature/presentation/components/reporte/reporte.component';
import { DatosGeograficosComponent } from '../../feature/presentation/components/datos-geograficos/datos-geograficos.component';
import { DashboardComponent } from '../../feature/inspection/presentation/dashboard/dashboard.component';
import { NuevaInspeccionComponent } from '../../feature/inspection/presentation/nueva-inspeccion/nueva-inspeccion.component';
import {
    VerDetalleInspeccionComponent
} from '../../feature/inspection/presentation/ver-detalle-inspeccion/ver-detalle-inspeccion.component';
import { PacientesComponent } from '../../feature/presentation/components/pacientes/pacientes.component';
import { TodasInspeccionesComponent } from '../../feature/inspection/presentation/todas-inspecciones/todas-inspecciones.component';
import { DoctorComponent } from '../../feature/doctor/presentation/doctor-component/doctor.component';
import { RoleGuard } from '../../shared/guards/role.guard';

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
