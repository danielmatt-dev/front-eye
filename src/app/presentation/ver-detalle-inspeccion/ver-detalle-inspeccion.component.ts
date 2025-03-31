import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { PrimeTemplate } from 'primeng/api';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [InputText, Button, ProgressBar, PrimeTemplate],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent {

    red = '#f87171';
    amber = '#FB923C';
    blue = '#38BDF8';
    green = '#4ADE80';

}
