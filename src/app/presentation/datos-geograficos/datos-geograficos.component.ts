import { Component } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { Chip } from 'primeng/chip';
import { NgClass, NgForOf } from '@angular/common';

@Component({
    selector: 'app-datos-geograficos',
    imports: [Calendar, FormsModule, Button, RadioButton, Chip, NgForOf, NgClass],
    templateUrl: './datos-geograficos.component.html',
    standalone: true,
    styleUrl: './datos-geograficos.component.scss'
})
export class DatosGeograficosComponent {
    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: 'Últimos 2 meses', selected: false },
        { label: 'Últimos 3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    seleccionarChip(categoriaSeleccionada: any) {
        this.categorias.forEach((c) => (c.selected = false));
        categoriaSeleccionada.selected = true;
        if (categoriaSeleccionada.label === 'Personalizado') {
            this.calendarDisabled = false
        } else {
            this.calendarDisabled = true
            this.fechasSeleccionadas = []
        }
    }

}
