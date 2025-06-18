import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator, ButtonModule, TranslatePipe, NgOptimizedImage],
    templateUrl: './access.component.html'
})
export class AccessComponent {

    constructor(
        private readonly router: Router,
        private readonly local: LocalStorageService
    ) {}

    async redirect() {

        const role = this.local.getRole()
        if (role === 'ADMIN') {
            await this.router.navigate(['/insights/dashboard'])
        }

        if (role === 'DOCTOR') {
            await this.router.navigate(['/insights/nueva-inspeccion'])
        }

    }

}
