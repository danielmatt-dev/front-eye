import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateLang, TypeList } from '../../utils/functions/translate-lang';
import { reloadOnLangChange } from '../../utils/functions/i18n-refresh';
import { OptionLabel } from '../../utils/data';

@Component({
    selector: 'app-opciones-consulta',
    imports: [Button, NgForOf, TranslatePipe, NgClass, FormsModule, DatePickerModule, NgIf],
    templateUrl: './opciones-consulta.component.html',
    standalone: true,
    styleUrl: './opciones-consulta.component.scss'
})
export class OpcionesConsultaComponent implements OnInit {
    @Output() periodoSeleccionado = new EventEmitter<OptionLabel>();
    @Output() rangoFechasSeleccionado = new EventEmitter<Date[]>();
    @Output() consultar = new EventEmitter<void>();
    @Output() limpiar = new EventEmitter<Date[]>();
    @Output() mostrarBotonesChanged = new EventEmitter<boolean>();
    @Output() exportPDF = new EventEmitter<void>();
    @Output() exportExcel = new EventEmitter<void>();

    @Input() showButtons!: boolean;

    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    categorySelected: CategoriaItem | undefined;
    categories: CategoriaItem[] = [];

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly translateService: TranslateService,
        private readonly translateLang: TranslateLang,
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        reloadOnLangChange(this.translateService, this.destroyRef, this.loadPeriods);
    }

    seleccionarChip(categoriaSeleccionada: any): void {
        // Si el chip ya está seleccionado, lo deseleccionamos
        if (categoriaSeleccionada.selected) {
            categoriaSeleccionada.selected = false;
            this.categorySelected = undefined;
            this.periodoSeleccionado.emit(undefined); // Emitir vacío al deseleccionar
            this.calendarDisabled = true;
            this.fechasSeleccionadas = [];
            this.emitirRangoFechas();
            return;
        }

        // Deseleccionar todos los chips
        this.categories.forEach((c) => (c.selected = false));

        // Seleccionar el chip actual
        categoriaSeleccionada.selected = true;
        this.categorySelected = categoriaSeleccionada;

        this.periodoSeleccionado.emit({ label: categoriaSeleccionada.label, value: categoriaSeleccionada.value });

        // Activar o desactivar el calendario según el tipo de selección
        if (categoriaSeleccionada.value === -1) {
            this.calendarDisabled = false;
        } else {
            this.calendarDisabled = true;
            this.fechasSeleccionadas = [];
            this.emitirRangoFechas();
        }
    }

    private readonly loadPeriods = () => {
        const periods = this.translateLang.getTranslateList({ type: TypeList.period });
        const categories = [
            { label: periods[0], selected: false, value: 0 },
            { label: periods[1], selected: false, value: 1 },
            { label: periods[2], selected: false, value: 2 },
            { label: periods[3], selected: false, value: -1 }
        ];

        categories.forEach(cat => {
            if (cat.value === this.categorySelected?.value) {
                cat.selected = true
            }
        })
        this.categories = categories

        this.cdr.markForCheck();
    };

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

    onExportPDF() {
        this.exportPDF.emit();
    }

    onExportExcel() {
        this.exportExcel.emit();
    }

    onLimpiar(): void {
        this.fechasSeleccionadas = [];
        this.rangoFechasSeleccionado.emit(this.fechasSeleccionadas);
    }
}

interface CategoriaItem {
    label: string;
    selected: boolean;
    value: number; // o 0 | 1 si solo usas esos
}
