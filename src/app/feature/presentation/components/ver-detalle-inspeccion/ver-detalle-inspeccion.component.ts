import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { mapColors } from '../../../../core/theme/colors';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [Button, ProgressBar, PrimeTemplate, TableModule],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent {

    red = mapColors['red']
    amber = mapColors['amber']
    blue = mapColors['blue']
    green = mapColors['green']

    async onRowSelect(event: any) {}

}
