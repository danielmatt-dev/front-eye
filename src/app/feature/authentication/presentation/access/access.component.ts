import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * Componente de pantalla "Acceso denegado".
 *
 * @description
 * Muestra un mensaje de error cuando el usuario intenta ingresar
 * a una sección restringida sin los permisos adecuados.  
 * Incluye un título, mensaje de apoyo, imagen ilustrativa y un botón
 * para regresar al inicio.
 *
 * @remarks
 * Es un componente Angular independiente (`standalone: true`)
 * que utiliza PrimeNG (`ButtonModule`, `RippleModule`), el pipe
 * de traducción (`TranslatePipe`) y `NgOptimizedImage` para la imagen.
 *
 * @example
 * ```html
 * <app-access></app-access>
 * ```
 */
@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator, ButtonModule, TranslatePipe, NgOptimizedImage],
    templateUrl: './access.component.html'
})
export class AccessComponent { }
