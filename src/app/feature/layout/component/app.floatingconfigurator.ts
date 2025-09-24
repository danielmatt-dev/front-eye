import { Component, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../shared/services/local.storage.service';

@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonModule, StyleClassModule, AppConfigurator],
    standalone: true,
    template: `
        <div class="fixed flex gap-4 top-8 right-8">
            <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />

            <button type="button" class="layout-topbar-action" (click)="toggleLanguage()">
                {{ isLanguageEs() ? 'ES' : 'EN' }}
            </button>

            <!-- Botón para cambiar el tema y estilo de la aplicación
            <div class="relative">
                <p-button icon="pi pi-palette" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true" type="button" rounded />
                <app-configurator />
            </div>
            -->
            <app-configurator />
        </div>
    `
})
export class AppFloatingConfigurator {

    constructor(
        public layoutService: LayoutService,
        private readonly translateService: TranslateService,
        public readonly local: LocalStorageService
    ) {
    }

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleLanguage() {
        const lang = this.isLanguageEs() ? 'en' : 'es'
        this.local.setLang(lang)
        this.translateService.use(lang)
    }

    isLanguageEs(): boolean {
        return this.local.getLang() === 'es'
    }

}
