import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { InputText } from 'primeng/inputtext';
import { NgClass, NgForOf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { inspecciones } from '../../../../shared/utils/mocks';

@Component({
    standalone: true,
    selector: 'app-todas-inspecciones',
    imports: [Button, Calendar, InputText, NgForOf, PrimeTemplate, TableModule, NgClass, FormsModule, DialogModule, TranslatePipe],
    templateUrl: './todas-inspecciones.component.html',
    styleUrl: './todas-inspecciones.component.scss'
})
export class TodasInspeccionesComponent implements OnInit {
    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;
    inspections = inspecciones

    labelInspection = 'inspección';
    labelInspections = 'inspecciones';

    selectedInspecciones = [];

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

        this.translateService.get('inspections.singular').subscribe((res: string) => {
            this.labelInspection = res.toLowerCase();
        });

        this.translateService.get('inspections.plural').subscribe((res: string) => {
            this.labelInspections = res.toLowerCase();
        });
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
