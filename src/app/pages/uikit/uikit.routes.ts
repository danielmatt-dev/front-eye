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

export default [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'reportes', component: ReporteComponent },
    { path: 'datos-geograficos', component: DatosGeograficosComponent },
    { path: 'nueva-inspeccion', component: NuevaInspeccionComponent },
    { path: 'ver-detalle', component: VerDetalleInspeccionComponent },
    { path: 'todas-inspecciones', component: TodasInspeccionesComponent },
    { path: 'pacientes', component: PacientesComponent },
    { path: 'doctores', component: DoctorComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
