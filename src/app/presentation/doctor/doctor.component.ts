import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { NgClass, NgForOf } from '@angular/common';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';

@Component({
    standalone: true,
    selector: 'app-doctor',
    imports: [NgClass, Calendar, FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, NgForOf, InputText],
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss'
})
export class DoctorComponent {
    visible = false;

    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    selectedDoctores = [];

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: '2 meses', selected: false },
        { label: '3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    abrirModal() {
        this.visible = true;
    }

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

    cerrarVentanaNotificacion() {
        this.visible = false;
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
