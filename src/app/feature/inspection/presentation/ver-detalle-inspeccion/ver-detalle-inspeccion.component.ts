import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { mapColors } from '../../../../core/theme/colors';
import { TranslatePipe } from '@ngx-translate/core';
import { inspecciones } from '../../../../shared/utils/mocks';
import { Image } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Carousel } from 'primeng/carousel';
import { Galleria, GalleriaModule } from 'primeng/galleria';

@Component({
    selector: 'app-ver-detalle-inspeccion',
    standalone: true,
    imports: [Button, ProgressBar, PrimeTemplate, TableModule, TranslatePipe, Image, FormsModule, ToastModule, Carousel, GalleriaModule],
    providers: [MessageService],
    templateUrl: './ver-detalle-inspeccion.component.html',
    styleUrl: './ver-detalle-inspeccion.component.scss'
})
export class VerDetalleInspeccionComponent implements OnInit, OnDestroy {
    red = mapColors['red'];
    amber = mapColors['amber'];
    blue = mapColors['blue'];
    green = mapColors['green'];

    inspecciones = inspecciones.filter((ins) => ins.paciente === 'P001');

    images: GalleryImage[] = [
        {
            itemImageSrc:      'assets/images/fondo_ojo.jpg',
            thumbnailImageSrc: 'assets/images/fondo_ojo.jpg',
            title:             'Image 1'
        },
        {
            itemImageSrc:      'assets/images/fondo_ojo.jpg',
            thumbnailImageSrc: 'assets/images/fondo_ojo.jpg',
            title:             'Image 2'
        },
        {
            itemImageSrc:      'assets/images/fondo_ojo.jpg',
            thumbnailImageSrc: 'assets/images/fondo_ojo.jpg',
            title:             'Image 3'
        }
    ];

    showThumbnails: boolean | undefined;

    fullscreen: boolean = false;

    activeIndex: number = 0;

    onFullScreenListener: any;

    @ViewChild('galleria') galleria: Galleria | undefined;

    responsiveOptions = [
        { breakpoint: '1300px', numVisible: 4 },
        { breakpoint: '575px',  numVisible: 1 }
    ];


    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        @Inject(PLATFORM_ID) private platformId: any,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.bindDocumentListeners();
    }

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

    ngOnDestroy() {
        this.unbindDocumentListeners();
    }

    galleriaClass() {
        return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
    }

    fullScreenIcon() {
        return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
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
}

interface GalleryImage {
    itemImageSrc:      string;
    thumbnailImageSrc: string;
    title:             string;
    alt?:              string;
}
