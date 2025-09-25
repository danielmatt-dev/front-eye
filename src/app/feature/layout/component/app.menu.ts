import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../shared/services/local.storage.service';
import { AuthService } from '../../../shared/services/auth.service';
import { menu } from '../../../shared/utils/data';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { routes } from '../../../shared/routes/dict-routes';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly local: LocalStorageService,
        private readonly translateService: TranslateService,
        private readonly cdr: ChangeDetectorRef,
    ) {}

    async ngOnInit() {
        this.buildMenu()

        this.translateService.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.buildMenu()
                this.cdr.markForCheck()
            })
    }

    private buildMenu() {
        const userRole = this.local.getRole()
        const lang = this.local.getLang()

        const labels = lang === 'es' ? menu.es : menu.en

        if (userRole === 'ADMIN') {
            this.model = [
                {
                    items: [
                        { label: labels.dashboard, icon: 'pi pi-fw pi-chart-bar', routerLink: [`/insights/${routes.dashboard}`] },
                        //{ label: 'Reportes', icon: 'pi pi-fw pi-folder-open', routerLink: ['/insights/reportes'] },
                        { label: labels.inspections, icon: 'pi pi-list', routerLink: [`/insights/${routes.allInspections}`] },
                        {
                            label: labels.geo,
                            icon: 'pi pi-fw pi-globe',
                            routerLink: [`/insights/${routes.geographicData}`]
                        },
                        {
                            label: labels.doctors,
                            icon: 'pi pi-fw pi-user',
                            routerLink: [`/insights/${routes.doctors}`]
                        },
                        {
                            label: labels.logout,
                            icon: 'pi pi-fw pi-sign-out',
                            command: () => { this.logout().then() }
                        }
                    ]
                }
            ];
        }

        if (userRole === 'DOCTOR') {
            this.model = [
                {
                    items: [
                        {
                            label: labels.adminInspections,
                            icon: 'pi pi-fw pi-eye',
                            expanded: true,
                            items: [
                                {
                                    label: labels.newInspection,
                                    icon: 'pi pi-fw pi-plus-circle',
                                    routerLink: [`/insights/${routes.newInspection}`]
                                },
                                {
                                    label: labels.allInspections,
                                    icon: 'pi pi-list',
                                    routerLink: [`/insights/${routes.allInspections}`]
                                }
                            ]
                        },
                        {
                            label: labels.patients,
                            icon: 'pi pi-fw pi-user',
                            routerLink: [`/insights/${routes.patients}`]
                        },
                        //{ label: 'Reportes', icon: 'pi pi-fw pi-folder-open', routerLink: ['/insights/reportes'] },
                        {
                            label: labels.logout,
                            icon: 'pi pi-fw pi-sign-out',
                            command: () => { this.logout().then() }
                        }
                    ]
                }
            ];
        }
    }

    async logout() {
        this.local.clear()
        this.authService.stopTokenWatcher()
        await this.router.navigate(['/']);
    }

}
