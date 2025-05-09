import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { mapColors } from '../../../../core/theme/colors';
import { TranslatePipe } from '@ngx-translate/core';
import { inspecciones } from '../../../../shared/utils/mocks';
import { Image } from 'primeng/image';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [Button, ProgressBar, PrimeTemplate, TableModule, TranslatePipe, Image, FormsModule],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent {
    red = mapColors['red'];
    amber = mapColors['amber'];
    blue = mapColors['blue'];
    green = mapColors['green'];

    inspecciones = inspecciones;

    async onRowSelect(event: any) {}
}
