import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { inspectionResponseMocks } from '../../../../shared/utils/mocks';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { GetAllInspections } from '../../domain/use_cases/getAllInspections';
import { NoParams } from '../../../../shared/utils/usecase';
import { InspectionResponseEntity } from '../../domain/entity/inspection.response.entity';
import { FilterService } from '../../../../shared/services/filter.service';
import { DatePipe, NgIf } from '@angular/common';
import {
    BaseValidatorHelper
} from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';

@Component({
    standalone: true,
    selector: 'app-todas-inspecciones',
    imports: [Button, InputText, PrimeTemplate, TableModule, FormsModule, DialogModule, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ToastModule, DatePipe, NgIf],
    providers: [MessageService],
    templateUrl: './todas-inspecciones.component.html',
    styleUrl: './todas-inspecciones.component.scss'
})
export class TodasInspeccionesComponent implements OnInit {
    /* Variables de interacción con html */
    isDoctor = true;

    /* Opciones de la tabla*/
    @ViewChild('filter') filter!: ElementRef;
    isLoading = true;

    /* Variables para opciones de consulta */
    selectedDates: Date[] = [];
    selectedPeriod = '';

    /* Lista de inspecciones y filtrado */
    allInspections: InspectionResponseEntity[] = inspectionResponseMocks;
    filteredInspections = this.allInspections;
    selectedInspections: InspectionResponseEntity[] = [];

    /* Labels */
    labelInspection = 'inspección';
    labelInspections = 'inspecciones';

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    validationHelper: BaseValidatorHelper;

    constructor(
        private readonly primeng: PrimeNG,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly router: Router,
        private readonly local: LocalStorageService,
        private readonly getAllInspection: GetAllInspections,
        private readonly filterService: FilterService
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
        this.validationHelper = BaseValidatorHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    async ngOnInit() {
        this.isDoctor = this.local.getRole() === 'DOCTOR';

        this.translateService.get('inspections.singular').subscribe((res: string) => {
            this.labelInspection = res.toLowerCase();
        });

        this.translateService.get('inspections.plural').subscribe((res: string) => {
            this.labelInspections = res.toLowerCase();
        });

        await this.callGetAllInspections();
    }

    /* Llamadas a casos de uso */
    async callGetAllInspections() {
        this.isLoading = true;
        const resultGetAllInspections = await this.getAllInspection.call(new NoParams());
        this.isLoading = false;

        if (resultGetAllInspections._tag === 'Left') {
            this.validationHelper.getToastException(resultGetAllInspections.left);
        }

        if (resultGetAllInspections._tag === 'Right') {
            //this.allInspections = resultGetAllInspections.right;
            this.filterInspections();
        }
    }

    /* Filtrado de lista de doctores */
    filterInspections() {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.selectedPeriod, this.selectedDates)) {
            return;
        }

        this.filteredInspections = this.filterService.filterByPeriodo(this.allInspections, (ins) => ins.inspectionDate, this.selectedPeriod, this.selectedDates);
    }

    /* Funciones de navegación hacia otras pantallas */
    async natigateToNewInspection() {
        await this.router.navigate(['/insights/nueva-inspeccion']);
    }

    async navigateToInspectionDetails(id?: number) {
        if (!id) {
            await this.router.navigate(['/insights/ver-detalle']);
            return;
        }

        await this.router.navigate(['/insights/ver-detalle'], { queryParams: { id } });
    }

    /*  Funciones de iteración con html */
    onPeriodSelected(periodo: string) {
        this.selectedPeriod = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
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
