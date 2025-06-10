import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { mapColors } from '../../../../core/theme/colors';
import { TranslatePipe } from '@ngx-translate/core';
import { inspecciones } from '../../../../shared/utils/mocks';
import { Image } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [Button, ProgressBar, PrimeTemplate, TableModule, TranslatePipe, Image, FormsModule, ToastModule],
    providers: [MessageService],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent {
    red = mapColors['red'];
    amber = mapColors['amber'];
    blue = mapColors['blue'];
    green = mapColors['green'];

    inspecciones = inspecciones.filter((ins) => ins.paciente === 'P001');

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {}

    async onRowSelect(event: any) {}

    async cancelar() {
        await this.router.navigate(['/insights/nueva-inspeccion']);
    }

    descargar() {
        this.messageService.add({
            severity: 'info',
            summary: 'Funcionalidad en Desarrollo',
            detail: 'Esta característica aún está en desarrollo.'
        });
    }
}
