import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { mapColors } from '../../../../core/theme/colors';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { exampleInspectionDetails, inspecciones } from '../../../../shared/utils/mocks';
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
import { InspectionImageEntity } from '../../domain/entity/inspection.details.entity';
import { DiagnosticProbabilityEntity } from '../../domain/entity/inspection.request.entity';
import { colorByResult, formatDateToSpanishMexico } from '../../../../shared/utils/functions/functions';
import { CommonModule } from '@angular/common';
import { LocaleTextProvider } from '../../../../shared/locale.text.provider';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [Button, ProgressBar, PrimeTemplate, TableModule, TranslatePipe, Image, FormsModule, ToastModule, GalleriaModule, CommonModule],
    providers: [MessageService],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent implements OnInit, OnDestroy {

    inspecciones = inspecciones.filter((ins) => ins.paciente === 'P001');

    showThumbnails: boolean | undefined;

    fullscreen: boolean = false;

    activeIndex: number = 0;

    onFullScreenListener: any;

    @ViewChild('galleria') galleria: Galleria | undefined;

    responsiveOptions = [
        { breakpoint: '1300px', numVisible: 3 },
        { breakpoint: '575px',  numVisible: 1 }
    ];

    // Id de la inspección
    inspectionId?: number

    // Variables de la inspeción
    inspection?: InspectionResponseEntity

    // Variables del paciente
    patient?: PatientResponseEntity

    // Imágenes
    imagesResponse: InspectionImageEntity[] = []

    // Probabilidades de la inspección
    probabilities: DiagnosticProbabilityEntity[] = []

    // Lista de inspecciones
    allInspections: InspectionResponseEntity[] = []

    // Resultado de inspección
    result?: string
    colorResult?: string = mapColors.red

    // Providers
    validatorHelper: ValidatorHelper
    localeTextProvider: LocaleTextProvider

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly primeNg: PrimeNG,
        @Inject(PLATFORM_ID) private platformId: any,
        private cd: ChangeDetectorRef,
        private readonly route: ActivatedRoute,
        private readonly getInspectionById: GetInspectionById
    ) {
        this.validatorHelper = BaseValidatorHelper.getInstance(this.messageService, this.translateService, this.primeNg)
        this.localeTextProvider = LocaleTextProvider.getInstance(this.translateService, this.primeNg)
    }

    ngOnInit() {
        this.bindDocumentListeners();

        this.route.queryParamMap.subscribe(params => {
            const idParam = params.get('inspectionId');
            this.inspectionId = idParam !== null
                ? Number(idParam)
                : undefined;
        });

        this.inspection = exampleInspectionDetails.inspection
        this.patient = exampleInspectionDetails.patient
        this.imagesResponse = exampleInspectionDetails.images
        this.probabilities = exampleInspectionDetails.probabilities
        this.allInspections = exampleInspectionDetails.inspectionHistory
        this.colorResult = colorByResult(exampleInspectionDetails.inspection.result)
    }

    ngOnDestroy() {
        this.unbindDocumentListeners();
    }

    /* Llamadas a casos de uso */
    async callGetInspectionById() {

        if (!this.inspectionId) {
            return
        }

        const resultGetInspectionById = await this.getInspectionById.call(this.inspectionId)

        if (resultGetInspectionById._tag === 'Left') {
            this.validatorHelper.getToastException(resultGetInspectionById.left)
        }

        if (resultGetInspectionById._tag === 'Right') {
            const details = resultGetInspectionById.right
            this.inspection = details.inspection
            this.patient = details.patient
            this.imagesResponse = details.images
            this.probabilities = details.probabilities
            this.allInspections = details.inspectionHistory
            this.colorResult = colorByResult(details.inspection.result)
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
        }
        else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        }
        else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
        else if (doc.msExitFullscreen) {
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
        const id = event.data.inspectionId
        await this.router.navigate(
            ['/insights/ver-detalle'],
            { queryParams: { id } }
        );
    }

    async cancelar() {
        await this.router.navigate(['/insights/nueva-inspeccion']);
    }

    descargar() {
        this.messageService.add({
            severity: 'info',
            summary: 'Funcionalidad en Desarrollo',
            detail: 'Esta característica aún está en desarrollo.'
        });
    }

    protected readonly formatDateToSpanishMexico = formatDateToSpanishMexico;
    protected readonly colorByResult = colorByResult;
}
