import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { InspectionResponseEntity } from '../../domain/entity/inspection.response.entity';
import { PatientResponseEntity } from '../../../patient/domain/entity/patient.response.entity';
import { InspectionDetailsEntity, InspectionImageEntity } from '../../domain/entity/inspection.details.entity';
import { DiagnosticProbabilityEntity } from '../../domain/entity/inspection.request.entity';
import { colorByResult, formatDateToSpanishMexico } from '../../../../shared/utils/functions/functions';
import { CommonModule } from '@angular/common';
import { LocaleTextProvider } from '../../../../shared/locale.text.provider';
import { SkeletonModule } from 'primeng/skeleton';
import { InspectionDetailsPdf } from '../../../report/domain/template-method/pdf/inspection-details.pdf';
import { SendMessage } from '../../../../shared/toast/send.message';

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

    details?: InspectionDetailsEntity;

    // Variables de la inspeción
    inspection?: InspectionResponseEntity;

    // Variables del paciente
    patient?: PatientResponseEntity;
    doctor = ''

    // Imágenes
    imagesResponse: InspectionImageEntity[] = [];

    // Probabilidades de la inspección
    probabilities: DiagnosticProbabilityEntity[] = [];

    // Lista de inspecciones
    allInspections: InspectionResponseEntity[] = [];

    // Resultado de inspección
    result?: string;
    colorResult?: string = mapColors.red;

    // Providers
    validatorHelper: ValidatorHelper;
    localeTextProvider: LocaleTextProvider;

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
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

        await this.callGetInspectionById()
    }

    ngOnDestroy() {
        this.unbindDocumentListeners();
    }

    /* Llamadas a casos de uso */
    async callGetInspectionById() {
        if (!this.inspectionId) {
            return;
        }

        const resultGetInspectionById = await this.getInspectionById.call(this.inspectionId);

        if (resultGetInspectionById._tag === 'Left') {
            this.validatorHelper.getToastException(resultGetInspectionById.left);
        }

        if (resultGetInspectionById._tag === 'Right') {
            const details = resultGetInspectionById.right;
            this.details = details
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
            return
        }

        this.inspectionDetailsPdf.generate(this.details)
    }

    protected readonly formatDateToSpanishMexico = formatDateToSpanishMexico;
    protected readonly colorByResult = colorByResult;
}
