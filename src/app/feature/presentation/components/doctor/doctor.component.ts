import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { NgClass, NgForOf } from '@angular/common';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { doctores, generos } from '../reporte/mocks';
import { DatePicker } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-doctor',
    imports: [NgClass, Calendar, FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, NgForOf, InputText, DatePicker, TranslatePipe],
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit {
    visible = false;

    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    selectedDoctores = [];

    doctores = doctores;

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: '2 meses', selected: false },
        { label: '3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    labelDoctor = 'doctor'
    labelDoctors = 'doctores'

    constructor(
        private primeng: PrimeNG,
        private translateService: TranslateService
    ) {}

    ngOnInit() {
        this.translateService.use('es');
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res));

        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase()
        })

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase()
        })

    }

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

    protected readonly generos = generos;
}
