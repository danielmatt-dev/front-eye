import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [DropdownModule, FormsModule, Calendar, TableModule, InputText, ButtonModule, Select],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.scss'
})
export class ReporteComponent implements AfterViewInit {
    @ViewChild(Calendar) calendar!: Calendar;

    afecciones = ['Opción 1', 'Opción 2', 'Opción 3'];
    afeccionSeleccionada?: string = undefined;
    resultados = ['Opción 1', 'Opción 2', 'Opción 3'];
    resultadoSeleccionado?: string = undefined;

    fechasSeleccionadas: Date[] = [];

    ngAfterViewInit(): void {}

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

