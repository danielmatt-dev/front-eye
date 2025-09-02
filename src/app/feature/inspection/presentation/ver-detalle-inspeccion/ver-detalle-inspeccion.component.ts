import { ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { mapColors } from '../../../../core/theme/colors';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Image } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Galleria, GalleriaModule } from 'primeng/galleria';
import { GetInspectionById } from '../../domain/use_cases/getInspectionById';
import { ValidatorHelper } from '../../../../shared/utils/validator.helper';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { PrimeNG } from 'primeng/config';
import { colorByResult } from '../../../../shared/utils/functions/functions';
import { CommonModule } from '@angular/common';
import { LocaleTextProvider } from '../../../../shared/locale.text.provider';
import { SkeletonModule } from 'primeng/skeleton';
import { InspectionDetailsPdf } from '../../../report/domain/template-method/pdf/inspection-details.pdf';
import { SendMessage } from '../../../../shared/toast/send.message';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';
import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { DiagnosticProbabilityModel } from '../../data/models/inspection.request.model';
import { InspectionDetailsModel, InspectionImageModel } from '../../data/models/inspection.details.model';
import { reloadOnLangChange } from '../../../../shared/utils/functions/i18n-refresh';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [Button, ProgressBar, PrimeTemplate, TableModule, TranslatePipe, Image, FormsModule, ToastModule, GalleriaModule, CommonModule, SkeletonModule],
    providers: [MessageService],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent implements OnInit, OnDestroy {
    showThumbnails: boolean | undefined;

    fullscreen: boolean = false;

    activeIndex: number = 0;

    onFullScreenListener: any;

    @ViewChild('galleria') galleria: Galleria | undefined;

    responsiveOptions = [
        { breakpoint: '1300px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    /* Variables de carga */
    isLoading = false;
    skeletonItems = Array(4);

    // Id de la inspección
    inspectionId?: number;

    details?: InspectionDetailsModel;

    // Variables de la inspeción
    inspection?: InspectionResponseModel;

    // Variables del paciente
    patient?: PatientResponseModel;
    doctor = '';

    // Imágenes
    imagesResponse: InspectionImageModel[] = [];

    // Probabilidades de la inspección
    probabilities: DiagnosticProbabilityModel[] = [];

    // Lista de inspecciones
    allInspections: InspectionResponseModel[] = [];

    // Resultado de inspección
    colorResult?: string = mapColors.red;

    // Fecha y hora formato
    dateFormat = 'dd/MM/yyyy'

    // Providers
    validatorHelper: ValidatorHelper;
    localeTextProvider: LocaleTextProvider;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly translateLang: TranslateLang,
        private readonly cdr: ChangeDetectorRef,
        private readonly primeNg: PrimeNG,
        private readonly cd: ChangeDetectorRef,
        private readonly route: ActivatedRoute,
        private readonly inspectionDetailsPdf: InspectionDetailsPdf,
        private readonly getInspectionById: GetInspectionById
    ) {
        this.validatorHelper = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeNg);
        this.localeTextProvider = LocaleTextProvider.getInstance(this.translateService, this.primeNg);
    }

    async ngOnInit() {
        this.bindDocumentListeners();

        this.route.queryParamMap.subscribe((params) => {
            const idParam = params.get('id');
            this.inspectionId = idParam !== null ? Number(idParam) : undefined;
        });

        await this.callGetInspectionById();
        reloadOnLangChange(this.translateService, this.destroyRef, this.translate);
    }

    ngOnDestroy() {
        this.unbindDocumentListeners();
    }

    private readonly translate = () => {

        this.dateFormat = this.translateLang.getDateFormat()

        if (this.inspection) {
            this.inspection.eyeOption = this.translateLang.translateByOptionLabel({
                value: this.inspection.eye,
                type: TypeList.eye
            });
            this.inspection.resultOption = this.translateLang.translateByOptionLabel({
                value: this.inspection.result,
                type: TypeList.result
            });
            this.inspection.diseaseOption = this.translateLang.translateByOptionLabel({
                value: this.inspection.diseaseId,
                type: TypeList.disease
            });
        }

        if (this.patient) {
            this.patient.genderOption = this.translateLang.translateByOptionLabel({
                value: this.patient.gender,
                type: TypeList.gender
            });
        }

        this.probabilities = this.probabilities.map((p) => {
            const option = this.translateLang.translateByOptionLabel({
                value: p.resultCategory,
                type: TypeList.result
            });
            p.resultOption = option;
            p.resultCategory = option.value;

            return p;
        });

        this.allInspections = this.allInspections.map((a) => {
            const eyeOption = this.translateLang.translateByOptionLabel({
                value: a.eye,
                type: TypeList.eye
            });
            a.eyeOption = eyeOption;
            a.eye = eyeOption.value;

            const resultOption = this.translateLang.translateByOptionLabel({
                value: a.result,
                type: TypeList.result
            });
            a.resultOption = resultOption;
            a.result = resultOption.value;

            return a;
        });

        this.cdr.markForCheck();
    };

    /* Llamadas a casos de uso */
    async callGetInspectionById() {
        if (!this.inspectionId) {
            return;
        }

        this.isLoading = true;
        const resultGetInspectionById = await this.getInspectionById.call(this.inspectionId);
        this.isLoading = false;

        if (resultGetInspectionById._tag === 'Left') {
            this.validatorHelper.getToastException(resultGetInspectionById.left);
        }

        if (resultGetInspectionById._tag === 'Right') {
            const details = resultGetInspectionById.right;
            this.details = details;
            this.inspection = details.inspection;
            this.patient = details.patient;
            this.doctor = details.inspection.doctor;
            this.imagesResponse = details.inspection.inspectionImages;
            this.probabilities = details.inspection.diagnosticProbabilities;
            this.allInspections = details.inspectionHistory;
            this.colorResult = colorByResult(details.inspection.result);
        }
    }

    // Funciones para la sección de imágenes
    toggleFullScreen() {
        if (this.fullscreen) {
            this.closePreviewFullScreen();
        } else {
            this.openPreviewFullScreen();
        }

        this.cd.detach();
    }

    openPreviewFullScreen() {
        let elem = this.galleria?.element.nativeElement.querySelector('.p-galleria');
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem['mozRequestFullScreen']) {
            /* Firefox */
            elem['mozRequestFullScreen']();
        } else if (elem['webkitRequestFullscreen']) {
            /* Chrome, Safari & Opera */
            elem['webkitRequestFullscreen']();
        } else if (elem['msRequestFullscreen']) {
            /* IE/Edge */
            elem['msRequestFullscreen']();
        }
    }

    onFullScreenChange() {
        this.fullscreen = !this.fullscreen;
        this.cd.detectChanges();
        this.cd.reattach();
    }

    closePreviewFullScreen() {
        const doc: any = document;

        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    }

    bindDocumentListeners() {
        this.onFullScreenListener = this.onFullScreenChange.bind(this);
        document.addEventListener('fullscreenchange', this.onFullScreenListener);
        document.addEventListener('mozfullscreenchange', this.onFullScreenListener);
        document.addEventListener('webkitfullscreenchange', this.onFullScreenListener);
        document.addEventListener('msfullscreenchange', this.onFullScreenListener);
    }

    unbindDocumentListeners() {
        document.removeEventListener('fullscreenchange', this.onFullScreenListener);
        document.removeEventListener('mozfullscreenchange', this.onFullScreenListener);
        document.removeEventListener('webkitfullscreenchange', this.onFullScreenListener);
        document.removeEventListener('msfullscreenchange', this.onFullScreenListener);
        this.onFullScreenListener = null;
    }

    galleriaClass() {
        return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
    }

    fullScreenIcon() {
        return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
    }

    // Funciones que interaccionan con el html
    async onRowSelect(event: any) {
        const id = event.data.inspectionId;
        await this.router.navigate(['/insights/ver-detalle'], { queryParams: { id } });
    }

    async cancel() {
        window.history.back();
    }

    exportPDF() {
        if (!this.details) {
            return;
        }

        this.inspectionDetailsPdf.generate(this.details);
    }

    protected readonly colorByResult = colorByResult;
}
