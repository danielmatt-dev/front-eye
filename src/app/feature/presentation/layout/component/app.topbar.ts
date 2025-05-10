import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, TranslatePipe],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <svg id="Capa_6" data-name="Capa 6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" class="w-[60px] h-[60px]">
                    <defs>
                        <style>
                            .cls-1 {
                                fill: var(--primary-color);
                            }
                        </style>
                    </defs>
                    <!-- Se eliminó el rectángulo de fondo para no mostrar color de fondo -->
                    <path
                        class="cls-1"
                        d="m1000,374.22c-345.61,0-625.78,280.17-625.78,625.78s280.17,625.78,625.78,625.78,625.78-280.17,625.78-625.78-280.17-625.78-625.78-625.78Zm413.4,754.27c-3.39,128.1-106.31,232.19-234.31,236.98-3.12.12-6.22.17-9.32.17-41.35,0-82.18-10.58-118.08-30.59-2.27-1.27-4.74-1.87-7.2-1.87-4.43,0-8.78,1.99-11.67,5.69-10.59,13.56-21.2,27.11-31.81,40.68-10.61-13.56-21.22-27.12-31.81-40.68-2.89-3.7-7.24-5.69-11.67-5.69-2.45,0-4.93.61-7.2,1.87-35.9,20.01-76.73,30.59-118.08,30.59-3.09,0-6.2-.06-9.32-.17-128-4.79-230.92-108.88-234.31-236.98-1.52-57.4,17.12-113.03,52.67-157.84,20.53,8.18,41.12,14.34,61.28,20.11-34.75,34.42-54.86,81.69-54.86,131.15,0,38.34,18.51,83.97,48.32,119.09,35.84,42.22,84.1,65.47,135.91,65.47h.33c73.62-.13,139.6-46.68,168.69-112.92,29.1,66.25,95.12,112.81,168.78,112.92,52.09,0,100.37-23.25,136.22-65.48,29.81-35.12,48.33-80.74,48.33-119.08,0-49.46-20.11-96.72-54.86-131.15,20.16-5.77,40.75-11.93,61.28-20.11,35.56,44.8,54.19,100.44,52.67,157.84Zm-691.68-6.58c0-39.28,20.49-73.78,51.37-93.39,19.95-12.67,45.5-11.97,65.08,1.29,6.64,4.5,13.3,9.43,19.97,14.87,25.44,20.76,47.63,45.99,66.24,75.33,12.46,19.65,12.35,45.04-.78,64.25-19.9,29.12-53.37,48.23-91.31,48.23-61.05,0-110.55-49.51-110.55-110.58Zm355.96-1.9c18.61-29.34,40.79-54.57,66.24-75.33,6.68-5.44,13.33-10.38,19.97-14.87,19.57-13.26,45.12-13.96,65.08-1.29,30.87,19.61,51.37,54.11,51.37,93.39,0,61.08-49.51,110.58-110.55,110.58-37.94,0-71.41-19.11-91.31-48.23-13.13-19.22-13.25-44.6-.78-64.25Zm331.55-267.82c-79.56,95.2-190.7,55.29-302.71,146.62-56.9,46.4-88.39,101.67-105.49,138.37-17.1-36.69-48.59-91.97-105.49-138.37-111.53-90.94-221.52-51.34-302.71-146.62-46.09-54.08-65.87-129.8-44.46-149.19,26.36-23.87,90.76,59.76,211.17,68.49,108.02,7.83,123.17-54.63,241.84-54.42,118.83.21,134.32,62.89,241.14,54.42,118.86-9.43,181.44-93.52,208.4-69.94,22,19.24,4.03,95.94-41.69,150.65Z"
                    />
                </svg>
                <span>{{ 'app.title' | translate }}</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>

                <!-- Botón para cambiar el tema y estilo de la aplicación
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
                -->
                <app-configurator />

            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
