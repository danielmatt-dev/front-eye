import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { InputText } from 'primeng/inputtext';
import { NgClass, NgForOf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
    standalone: true,
    selector: 'app-todas-inspecciones',
    imports: [Button, Calendar, InputText, NgForOf, PrimeTemplate, TableModule, NgClass, FormsModule, Dialog],
    templateUrl: './todas-inspecciones.component.html',
    styleUrl: './todas-inspecciones.component.scss'
})
export class TodasInspeccionesComponent {
    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    selectedInspecciones = [];

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
