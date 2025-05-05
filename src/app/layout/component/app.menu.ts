import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

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

    ngOnInit() {
        this.model = [
            {
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/insights/dashboard'] },
                    { label: 'Reportes', icon: 'pi pi-fw pi-folder-open', routerLink: ['/insights/reportes'] },
                    { label: 'Datos Geográficos', icon: 'pi pi-fw pi-globe', routerLink: ['/insights/datos-geograficos'] },
                    {
                        label: 'Administrar inspecciones',
                        icon: 'pi pi-fw pi-eye',
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
                    { label: 'Administrar pacientes', icon: 'pi pi-fw pi-user', routerLink: ['/insights/pacientes'] },
                    { label: 'Administrar doctores  ', icon: 'pi pi-fw pi-user', routerLink: ['/insights/doctores'] },
                ]
            }
        ];
    }
}
