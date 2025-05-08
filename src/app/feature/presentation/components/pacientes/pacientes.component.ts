import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { NgClass, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { patients } from '../../../../shared/utils/mocks';
import { PrimeNG } from 'primeng/config';

@Component({
    standalone: true,
    selector: 'app-pacientes',
    imports: [Button, Calendar, NgForOf, NgClass, FormsModule, InputText, PrimeTemplate, TableModule, Dialog, Select, TranslatePipe],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit {
    visible = false;
    labelPatient = 'paciente';
    labelPatients = 'pacientes';

    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    selectedPacientes = []

    patients = patients

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: '2 meses', selected: false },
        { label: '3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.translateService.use('es');
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res));

        this.translateService.get('patient.singular').subscribe((res: string) => {
            this.labelPatient = res.toLowerCase();
        });

        this.translateService.get('patient.plural').subscribe((res: string) => {
            this.labelPatients = res.toLowerCase();
        });
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
}
