import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../shared/services/local.storage.service';
import { AuthService } from '../../../shared/services/auth.service';

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

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly local: LocalStorageService
    ) {}

    async ngOnInit() {

        const userRole = this.local.getRole()

        if (userRole === 'ADMIN') {
            this.model = [
                {
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/insights/dashboard'] },
                        //{ label: 'Reportes', icon: 'pi pi-fw pi-folder-open', routerLink: ['/insights/reportes'] },
                        { label: 'Inspecciones', icon: 'pi pi-list', routerLink: ['/insights/todas-inspecciones'] },
                        {
                            label: 'Datos Geográficos',
                            icon: 'pi pi-fw pi-globe',
                            routerLink: ['/insights/datos-geograficos']
                        },
                        {
                            label: 'Administrar doctores  ',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/insights/doctores']
                        },
                        {
                            label: 'Cerrar sesión',
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
                            label: 'Administrar inspecciones',
                            icon: 'pi pi-fw pi-eye',
                            expanded: true,
                            items: [
                                {
                                    label: 'Nueva inspección',
                                    icon: 'pi pi-fw pi-plus-circle',
                                    routerLink: ['/insights/nueva-inspeccion']
                                },
                                {
                                    label: 'Todas las inspecciones',
                                    icon: 'pi pi-list',
                                    routerLink: ['/insights/todas-inspecciones']
                                }
                            ]
                        },
                        {
                            label: 'Administrar pacientes',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/insights/pacientes']
                        },
                        //{ label: 'Reportes', icon: 'pi pi-fw pi-folder-open', routerLink: ['/insights/reportes'] },
                        {
                            label: 'Cerrar sesión',
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
