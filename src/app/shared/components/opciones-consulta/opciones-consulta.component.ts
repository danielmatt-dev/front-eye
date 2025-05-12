import { Component, EventEmitter, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { NgClass, NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-opciones-consulta',
    imports: [Button, NgForOf, TranslatePipe, NgClass, FormsModule, DatePickerModule],
    templateUrl: './opciones-consulta.component.html',
    standalone: true,
    styleUrl: './opciones-consulta.component.scss'
})
export class OpcionesConsultaComponent {
    @Output() periodoSeleccionado = new EventEmitter<string>();
    @Output() rangoFechasSeleccionado = new EventEmitter<Date[]>();
    @Output() consultar = new EventEmitter<void>();

    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: '2 meses', selected: false },
        { label: '3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    seleccionarChip(categoriaSeleccionada: any) {
        this.categorias.forEach((c) => (c.selected = false));
        categoriaSeleccionada.selected = true;

        this.periodoSeleccionado.emit(categoriaSeleccionada.label);

        if (categoriaSeleccionada.label === 'Personalizado') {
            this.calendarDisabled = false;
        } else {
            this.calendarDisabled = true;
            this.fechasSeleccionadas = [];
            this.emitirRangoFechas();
        }
    }

    onFechaSeleccionada(fecha: Date[]) {
        this.fechasSeleccionadas = fecha;
        this.emitirRangoFechas();
    }

    private emitirRangoFechas() {
        this.rangoFechasSeleccionado.emit(this.fechasSeleccionadas);
    }

    onConsultar() {
        this.consultar.emit();
    }

}
