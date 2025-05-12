import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { doctores, generos } from '../../../../shared/utils/mocks';
import { DatePicker } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';

@Component({
    standalone: true,
    selector: 'app-doctor',
    imports: [FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, InputText, DatePicker, TranslatePipe, OpcionesConsultaComponent],
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit {
    visible = false;

    periodoSeleccionado = ''
    fechasSeleccionadas: Date[] = [];

    selectedDoctores = [];

    doctores = doctores;

    labelDoctor = 'doctor';
    labelDoctors = 'doctores';

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService
    ) {}

    ngOnInit() {
        this.translateService.use('es');
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res));

        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });
    }

    abrirModal() {
        this.visible = true;
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

    onPeriodoSeleccionado(periodo: string) {
        console.log('Periodo seleccionado:', periodo);
        this.periodoSeleccionado = periodo;
    }

    onRangoFechasSeleccionado(fechas: Date[]) {
        console.log('Rango de fechas seleccionado:', fechas);
        this.fechasSeleccionadas = fechas;
    }

    protected readonly generos = generos;
}
