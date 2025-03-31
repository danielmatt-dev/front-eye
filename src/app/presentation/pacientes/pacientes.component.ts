import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { NgClass, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';

@Component({
    standalone: true,
    selector: 'app-pacientes',
    imports: [Button, Calendar, NgForOf, NgClass, FormsModule, InputText, PrimeTemplate, TableModule],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {
    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    selectedPacientes = []

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: '2 meses', selected: false },
        { label: '3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    seleccionarChip(categoriaSeleccionada: any) {
        this.categorias.forEach((c) => (c.selected = false));
        categoriaSeleccionada.selected = true;
        if (categoriaSeleccionada.label === 'Personalizado') {
            this.calendarDisabled = false;
        } else {
            this.calendarDisabled = true;
            this.fechasSeleccionadas = [];
        }
    }

    async onRowSelect(event: any) {}

    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onKeyDown(event: KeyboardEvent) {
        console.log('Key Down:', event.key);
    }

    onKeyUp(event: KeyboardEvent) {
        console.log('Key Up:', event.key);
    }

}
